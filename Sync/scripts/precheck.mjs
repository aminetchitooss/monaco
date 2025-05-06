#!/usr/bin/env node

import {runValidators} from '../src/validators/index.mjs';
import {SETTINGS} from '../config/settings.mjs';

async function main() {
    try {
        await runValidators(SETTINGS.DATA_DIR);
        console.log('✅ Precheck passed: all JSON files are valid.');
    } catch (err) {
        console.error(`❌ Precheck failed: ${err.message}`);
        process.exit(1);
    }
}

main();
