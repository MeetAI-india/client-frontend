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
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}?role=owner`, {
        method: "GET",
    });
}

export function getAdminProjects() {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}?role=admin`, {
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
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}?include_deleted=true`, {
        method: "GET",
    });
}

export function getDeletedProjects() {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}?deleted_only=true`, {
        method: "GET",
    });
}

export function getDeletedProject(projectId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}?deleted=true`, {
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
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/members/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}


export function searchUsers(query, projectId) {
    const params = new URLSearchParams({
        search: query,
        limit: 10,
        include_deleted: false,
        project_id: projectId
    });
    return apiClient(`/users?${params.toString()}`, {
        method: "GET",
    });
}

// ── Member Permissions Endpoints ──────────────────────────────────────────────

export function getMemberPermissions(projectId, userId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/members/${userId}/permissions`, {
        method: "GET",
    });
}

export function updateMemberPermissions(projectId, userId, payload) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/members/${userId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteMemberPermissions(projectId, userId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/members/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ reset_permissions: true }),
    });
}
