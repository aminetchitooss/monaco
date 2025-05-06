import fs from 'fs/promises';

/**
 * Validates that a .json file is parseable.
 */
export class JsonValidator {
    /**
     * @param {string} filePath
     * @throws {Error} on invalid JSON
     */
    async validate(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            JSON.parse(content);
        } catch (err) {
            throw new Error(
                `Invalid JSON in ${filePath}: ${err.message}`
            );
        }
    }

    /**
     * @param {string} fileName
     * @returns {boolean}
     */
    supports(fileName) {
        return fileName.endsWith('.json');
    }
}
