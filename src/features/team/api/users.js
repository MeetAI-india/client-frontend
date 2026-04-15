import { apiClient } from "../../../config/api-client";
import { API_CONFIG } from "../../../config/api";

// ── Super Admin Endpoints ───────────────────────────────────────────────────

export function getUsers(params = {}) {
    const query = new URLSearchParams();

    if (params.search) query.append("search", params.search);
    if (params.is_active !== undefined && params.is_active !== null)
        query.append("is_active", params.is_active);
    if (params.is_super_admin !== undefined && params.is_super_admin !== null)
        query.append("is_super_admin", params.is_super_admin);
    if (params.include_deleted !== undefined)
        query.append("include_deleted", params.include_deleted);
    if (params.offset !== undefined) query.append("offset", params.offset);
    if (params.limit !== undefined) query.append("limit", params.limit);

    const queryString = query.toString();
    const url = `${API_CONFIG.ENDPOINTS.USERS}/all${queryString ? `?${queryString}` : ""}`;

    return apiClient(url, {
        method: "GET",
    });
}

export function createUser(payload) {
    return apiClient(API_CONFIG.ENDPOINTS.USERS, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function toggleUserActive(userId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.USERS}/${userId}/toggle-active`, {
        method: "PATCH",
    });
}