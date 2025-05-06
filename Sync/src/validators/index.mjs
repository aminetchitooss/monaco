import fs from 'fs/promises';
import path from 'path';
import {JsonValidator} from './jsonValidator.mjs';

/**
 * Runs an array of validators across all files in a directory.
 */
export class ValidatorRunner {
    /**
     * @param {Array<{ supports: (name:string)=>boolean, validate:(path:string)=>Promise<void> }>} validators
     */
    constructor(validators = []) {
        this.validators = validators;
    }

    /**
     * @param {string} rootDir
     */
    async run(rootDir) {
        await this._walk(rootDir);
    }

    async _walk(dir) {
        const entries = await fs.readdir(dir, {
            withFileTypes: true,
        });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await this._walk(fullPath);
            } else {
                for (const validator of this.validators) {
                    if (validator.supports(entry.name)) {
                        await validator.validate(fullPath);
                    }
                }
            }
        }
    }
}

/**
 * Shortcut for JSON validation.
 * @param {string} rootDir
 */
export async function runValidators(rootDir) {
    const runner = new ValidatorRunner([new JsonValidator()]);
    await runner.run(rootDir);
}
