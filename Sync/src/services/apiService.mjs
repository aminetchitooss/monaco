import {SETTINGS} from '../../config/settings.mjs';
import {AuthService} from './authService.mjs';


export class ApiClient {
    constructor() {
        this.auth = new AuthService();
    }

    async _rpc(method, params) {
        const token = await this.auth.getToken();
        const body = {
            jsonrpc: '2.0',
            method,
            params,
            id: Date.now(),
        };

        const res = await fetch(
            `${SETTINGS.API_BASE_URL}${SETTINGS.RPC_ENDPOINT}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );

        if (!res.ok) {
            throw new Error(`RPC error: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        if (json.error) {
            throw new Error(
                `RPC ${method} failed: ${json.error.code} ${json.error.message}`
            );
        }
        return json.result;
    }

    /** Retrieve the full registry array */
    getRegistry() {
        return this._rpc('get', { registry: null });
    }

    /** Overwrite the registry metadata array */
    upsertRegistry(registryArray) {
        return this._rpc('put', { registry: registryArray });
    }

    /** Create or update a single file’s data */
    upsertFileData(fileId, data) {
        return this._rpc('put', { [`registry@${fileId}`]: data });
    }

    /** Delete a single file’s data */
    deleteFileData(fileId) {
        return this._rpc('del', { [`registry@${fileId}`]: null });
    }
}
