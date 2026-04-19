import { apiClient } from "../../../config/api-client";
import { API_CONFIG } from "../../../config/api";

function getMeetingsBasePath(projectId) {
    return `${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/meetings`;
}

export function listProjectMeetings(projectId) {
    return apiClient(getMeetingsBasePath(projectId), {
        method: "GET",
    });
}

export function getMeeting(projectId, meetingId) {
    return apiClient(`${getMeetingsBasePath(projectId)}/${meetingId}`, {
        method: "GET",
    });
}

export function createMeeting(projectId, payload) {
    return apiClient(getMeetingsBasePath(projectId), {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateMeeting(projectId, meetingId, payload) {
    return apiClient(`${getMeetingsBasePath(projectId)}/${meetingId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteMeeting(projectId, meetingId) {
    return apiClient(`${getMeetingsBasePath(projectId)}/${meetingId}`, {
        method: "DELETE",
    });
}

export function updateMeetingPolicy(projectId, meetingId, payload) {
    return apiClient(`${getMeetingsBasePath(projectId)}/${meetingId}/policy`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function listParticipants(projectId, meetingId) {
    return apiClient(`${getMeetingsBasePath(projectId)}/${meetingId}/participants`, {
        method: "GET",
    });
}

export function addParticipant(projectId, meetingId, payload) {
    return apiClient(`${getMeetingsBasePath(projectId)}/${meetingId}/participants`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function removeParticipant(projectId, meetingId, userId) {
    return apiClient(`${getMeetingsBasePath(projectId)}/${meetingId}/participants/${userId}`, {
        method: "DELETE",
    });
}

export function changeParticipantRole(projectId, meetingId, userId, payload) {
    return apiClient(`${getMeetingsBasePath(projectId)}/${meetingId}/participants/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}
