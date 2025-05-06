#!/usr/bin/env node

import {syncDatabase} from '../src/services/fileService.mjs';
import {SETTINGS} from '../config/settings.mjs';

async function main() {
    try {
        await syncDatabase(SETTINGS.DATA_DIR);
        console.log('✅ Sync completed successfully.');
    } catch (err) {
        console.error(`❌ Sync failed: ${err.message}`);
        process.exit(1);
    }
}

main();
