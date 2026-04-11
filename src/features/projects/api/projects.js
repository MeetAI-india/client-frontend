import { apiClient } from "../../../config/api-client";
import { API_CONFIG } from "../../../config/api";

// ── Regular User Endpoints ──────────────────────────────────────────────────

export function getProjects(includeRole = true) {
    const query = includeRole ? "?include_role=true" : "";
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}${query}`, {
        method: "GET",
    });
}

export function getProject(projectId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}`, {
        method: "GET",
    });
}

export function getOwnedProjects() {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/mine/owned`, {
        method: "GET",
    });
}

export function getAdminProjects() {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/mine/admin`, {
        method: "GET",
    });
}

// ── Super Admin Endpoints ───────────────────────────────────────────────────

export function createProject(payload) {
    return apiClient(API_CONFIG.ENDPOINTS.PROJECTS, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateProject(projectId, payload) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteProject(projectId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}`, {
        method: "DELETE",
    });
}

export function getAllProjects() {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/all`, {
        method: "GET",
    });
}

export function getDeletedProjects() {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/deleted`, {
        method: "GET",
    });
}

export function getDeletedProject(projectId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/deleted/${projectId}`, {
        method: "GET",
    });
}

export function reactivateProject(projectId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/reactivate`, {
        method: "PATCH",
    });
}

// ── Member Endpoints ────────────────────────────────────────────────────────

export function getProjectMembers(projectId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/members`, {
        method: "GET",
    });
}

export function addProjectMember(projectId, payload) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/members`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function removeProjectMember(projectId, userId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/members/${userId}`, {
        method: "DELETE",
    });
}

export function changeMemberRole(projectId, userId, payload) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/members/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}