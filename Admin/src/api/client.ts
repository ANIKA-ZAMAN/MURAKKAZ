const BASE_URL = '/api';

const getAccessToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('murakkaz_admin_access_token');
    }
    return null;
};

const getRefreshToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('murakkaz_admin_refresh_token');
    }
    return null;
};

const setTokens = (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('murakkaz_admin_access_token', accessToken);
        localStorage.setItem('murakkaz_admin_refresh_token', refreshToken);
    }
};

const clearTokens = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('murakkaz_admin_access_token');
        localStorage.removeItem('murakkaz_admin_refresh_token');
    }
};

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

async function customFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    
    const token = getAccessToken();
    const headers = new Headers(options.headers || {});
    
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    let response = await fetch(url, config);

    if (response.status === 401) {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
            clearTokens();
            throw new Error('Unauthorized');
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(newToken => {
                const newHeaders = new Headers(config.headers);
                newHeaders.set('Authorization', `Bearer ${newToken}`);
                return fetch(url, { ...config, headers: newHeaders });
            }).catch(err => {
                return Promise.reject(err);
            });
        }

        isRefreshing = true;

        try {
            const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: refreshToken })
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                const newAccessToken = data.data.accessToken;
                const newRefreshToken = data.data.refreshToken || refreshToken;
                setTokens(newAccessToken, newRefreshToken);
                processQueue(null, newAccessToken);
                
                const newHeaders = new Headers(config.headers);
                newHeaders.set('Authorization', `Bearer ${newAccessToken}`);
                return await fetch(url, { ...config, headers: newHeaders });
            } else {
                clearTokens();
                processQueue(new Error('Refresh token invalid'));
                throw new Error('Refresh token invalid');
            }
        } catch (err) {
            clearTokens();
            processQueue(err);
            throw err;
        } finally {
            isRefreshing = false;
        }
    }

    return response;
}

export const apiClient = {
    async get<T>(url: string): Promise<T> {
        const res = await customFetch(url);
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    async post<T>(url: string, body?: any): Promise<T> {
        const res = await customFetch(url, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    async put<T>(url: string, body?: any): Promise<T> {
        const res = await customFetch(url, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    async delete<T>(url: string): Promise<T> {
        const res = await customFetch(url, { method: 'DELETE' });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    async upload<T>(url: string, formData: FormData): Promise<T> {
        const res = await customFetch(url, {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    }
};

export { setTokens, clearTokens, getAccessToken, getRefreshToken };
