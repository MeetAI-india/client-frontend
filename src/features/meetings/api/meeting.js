import { apiClient } from "../../../config/api-client";
import { API_CONFIG } from "../../../config/api";

// ── Path Helpers ─────────────────────────────────────────────

function getMeetingsBasePath(projectId) {
    return `${API_CONFIG.ENDPOINTS.PROJECTS}/${projectId}/meetings`;
}

function getMeetingPath(projectId, meetingId) {
    return `${getMeetingsBasePath(projectId)}/${meetingId}`;
}

function getParticipantsPath(projectId, meetingId) {
    return `${getMeetingPath(projectId, meetingId)}/participants`;
}

// ── Meetings ────────────────────────────────────────────────

export function listProjectMeetings(projectId) {
    return apiClient(getMeetingsBasePath(projectId), {
        method: "GET",
    });
}

export function getMeeting(projectId, meetingId) {
    return apiClient(getMeetingPath(projectId, meetingId), {
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
    return apiClient(getMeetingPath(projectId, meetingId), {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteMeeting(projectId, meetingId) {
    return apiClient(getMeetingPath(projectId, meetingId), {
        method: "DELETE",
    });
}

export function updateMeetingPolicy(projectId, meetingId, payload) {
    return apiClient(`${getMeetingPath(projectId, meetingId)}/policy`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

// ── Participants ─────────────────────────────────────────────

export function listParticipants(projectId, meetingId) {
    return apiClient(getParticipantsPath(projectId, meetingId), {
        method: "GET",
    });
}

export function addParticipant(projectId, meetingId, payload) {
    return apiClient(getParticipantsPath(projectId, meetingId), {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function removeParticipant(projectId, meetingId, userId) {
    return apiClient(`${getParticipantsPath(projectId, meetingId)}/${userId}`, {
        method: "DELETE",
    });
}

export function changeParticipantRole(projectId, meetingId, userId, payload) {
    return apiClient(
        `${getParticipantsPath(projectId, meetingId)}/${userId}/role`,
        {
            method: "PATCH",
            body: JSON.stringify(payload),
        }
    );
}

// ── Recording (kept simple too) ──────────────────────────────

export function startRecording(projectId, meetingId) {
    return apiClient(`${getMeetingPath(projectId, meetingId)}/recording/start`, {
        method: "POST",
    });
}

export function stopRecording(projectId, meetingId) {
    return apiClient(`${getMeetingPath(projectId, meetingId)}/recording/stop`, {
        method: "POST",
    });
}