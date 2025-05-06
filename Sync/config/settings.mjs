
export const SETTINGS = {
    DATA_DIR: process.env.DATA_DIR || 'data',

    API_BASE_URL: process.env.API_BASE_URL || 'https://your.rpc.api',
    AUTH_ENDPOINT: '/auth',
    RPC_ENDPOINT: '/rpc',

    AUTH_CREDENTIALS: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
    },

    // Cache the auth token for 10 minutes
    TOKEN_CACHE_DURATION_MS: 10 * 60 * 1000,
};
