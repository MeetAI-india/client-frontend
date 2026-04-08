import { apiClient } from "../../../config/api-client";
import { API_CONFIG } from "../../../config/api";

export function getProjects() {
    return apiClient(API_CONFIG.ENDPOINTS.PROJECTS, {
        method: "GET",
    });
}

export function getProject(projectId) {
    return apiClient(`${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}`, {
        method: "GET",
    });
}

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
