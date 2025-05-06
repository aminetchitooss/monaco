import crypto from 'crypto';

/**
 * Compute a SHA-256 hash of the given string content.
 * @param {string} content
 * @returns {string}
 */
export function hashContent(content) {
    return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Compute an MD5 hash of the given file path.
 * @param {string} filePath
 * @returns {string}
 */
export function hashFilePath(filePath) {
    return crypto.createHash('md5').update(filePath, 'utf8').digest('hex');
}
