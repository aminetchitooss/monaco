import {SETTINGS} from '../../config/settings.mjs';

/**
 * Handles obtaining and caching an auth token.
 */
export class AuthService {
    constructor() {
        this.token = null;
        this.tokenFetchedAt = 0;
    }

    /**
     * Returns a valid auth token, fetching a new one if expired.
     * @returns {Promise<string>}
     */
    async getToken() {
        const now = Date.now();
        if (
            this.token &&
            now - this.tokenFetchedAt < SETTINGS.TOKEN_CACHE_DURATION_MS
        ) {
            return this.token;
        }

        const res = await fetch(
            `${SETTINGS.API_BASE_URL}${SETTINGS.AUTH_ENDPOINT}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(SETTINGS.AUTH_CREDENTIALS),
            }
        );

        if (!res.ok) {
            throw new Error(
                `Auth failed: ${res.status} ${res.statusText}`
            );
        }

        const json = await res.json();
        if (!json.token) {
            throw new Error('Auth response missing token');
        }

        this.token = json.token;
        this.tokenFetchedAt = now;
        return this.token;
    }
}
