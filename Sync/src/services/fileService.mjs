import fs from 'fs/promises';
import path from 'path';
import {hashContent, hashFilePath,} from '../utils/hashUtil.mjs';
import {getCurrentTimestamp} from '../utils/dateUtil.mjs';
import {ApiClient} from './apiService.mjs';

/**
 * Scans a directory for JSON files, computes metadata & diffs,
 * then syncs with remote via ApiClient.
 */
export class FileSynchronizer {
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.api = new ApiClient();
    }

    /**
     * Full sync: scan, compare, and push changes.
     */
    async synchronize() {
        // 1. Scan local files
        const localFiles = await this._scanJsonFiles();

        // 2. Fetch remote registry
        const remoteList = (await this.api.getRegistry()) || [];
        const remoteMap = new Map(
            remoteList.map((item) => [item.fileId, item])
        );

        // 3. Build new registry metadata and API tasks
        const registryMeta = [];
        const tasks = [];

        // Creations & updates
        for (const file of localFiles) {
            const now = getCurrentTimestamp();
            const existing = remoteMap.get(file.fileId);
            registryMeta.push({
                fileId: file.fileId,
                filename: file.filePath,
                createdDate: existing?.createdDate || now,
                updatedDate: now,
                hash: file.hash,
            });
            tasks.push(() =>
                this.api.upsertFileData(file.fileId, file.content)
            );
        }

        // Deletions
        for (const fileId of remoteMap.keys()) {
            if (!localFiles.some((f) => f.fileId === fileId)) {
                tasks.push(() => this.api.deleteFileData(fileId));
            }
        }

        // Always upsert the registry metadata first
        tasks.unshift(() =>
            this.api.upsertRegistry(registryMeta)
        );

        // 4. Execute all API calls in parallel
        await Promise.all(tasks.map((fn) => fn()));
    }

    /** Recursively scan for `.json` files and return their metadata. */
    async _scanJsonFiles() {
        const collected = [];
        await this._walkDir(this.rootDir, collected);
        return collected;
    }

    async _walkDir(dir, collection) {
        const entries = await fs.readdir(dir, {
            withFileTypes: true,
        });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await this._walkDir(fullPath, collection);
            } else if (entry.name.endsWith('.json')) {
                const raw = await fs.readFile(fullPath, 'utf8');
                const hash = hashContent(raw);
                const fileId = hashFilePath(fullPath);
                collection.push({
                    fileId,
                    filePath: fullPath,
                    content: JSON.parse(raw),
                    hash,
                });
            }
        }
    }
}

/**
 * Convenience wrapper.
 * @param {string} rootDir
 */
export async function syncDatabase(rootDir) {
    const syncer = new FileSynchronizer(rootDir);
    await syncer.synchronize();
}
