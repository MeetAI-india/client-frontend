import { API_CONFIG } from "../config/api";
import { getCSRFToken } from "../config/csrf";

let isRefreshing = false;
let refreshPromise = null;

async function refreshToken() {
    if (!refreshPromise) {
        refreshPromise = fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH}`, {
            method: "POST",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Refresh failed");
                return res.json();
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

export async function apiClient(endpoint, options = {}, retry = true) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const isAuthEndpoint =
        endpoint.includes("/auth/login") ||
        endpoint.includes("/auth/signup") ||
        endpoint.includes("/auth/refresh");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (!isAuthEndpoint && ["POST", "PUT", "PATCH", "DELETE"].includes(options.method)) {
        const csrf = getCSRFToken();
        if (csrf) headers[API_CONFIG.CSRF_HEADER_NAME] = csrf;
    }

    const response = await fetch(url, {
        credentials: "include",
        ...options,
        headers,
    });

    if (response.status === 401 && retry && !isAuthEndpoint) {
        try {
            await refreshToken();
            return apiClient(endpoint, options, false);
        } catch (err) {
            throw new Error("Session expired");
        }
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "API Error");
    }

    return data;
}