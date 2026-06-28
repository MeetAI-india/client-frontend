import { Lock, Shield, Globe } from "lucide-react";

// ─────────────────────────────────────────────
//  Shared Form Configurations
// ─────────────────────────────────────────────

export const EDIT_MEETING_FIELDS = [
    {
        key: "title",
        label: "Meeting Title",
        type: "text",
        placeholder: "e.g. Q4 strategy sync",
        required: true,
    },
    {
        key: "scheduled_at",
        label: "Scheduled Time",
        type: "datetime-local",
        placeholder: "Choose a date and time",
    },
    {
        key: "meeting_url",
        label: "Meeting URL",
        type: "url",
        placeholder: "https://meet.example.com/room",
    },
    {
        key: "visibility",
        label: "Visibility",
        type: "dropdown",
        required: true,
        options: [
            { label: "Public", value: "public" },
            { label: "Restricted", value: "restricted" },
            { label: "Private", value: "private" },
        ],
    },
    {
        key: "gate_recording",
        label: "Gate Recording",
        type: "checkbox-toggle",
        description: "Restrict recording access to authorized participants only.",
        // Only show if visibility is 'restricted'
        showIf: (vals) => vals.visibility === "restricted",
    },
    {
        key: "gate_transcript",
        label: "Gate Transcript",
        type: "checkbox-toggle",
        description: "Restrict transcript access to authorized participants only.",
        showIf: (vals) => vals.visibility === "restricted",
    },
    {
        key: "gate_summary",
        label: "Gate Summary",
        type: "checkbox-toggle",
        description: "Restrict summary access to authorized participants only.",
        showIf: (vals) => vals.visibility === "restricted",
    },
    {
        key: "description",
        label: "Description / Agenda",
        type: "textarea",
        rows: 4,
        placeholder: "Add agenda notes, context, or goals for this meeting...",
    },
];

export const ADD_PARTICIPANT_ROLE_FIELDS = [
    {
        key: "role",
        label: "Role",
        type: "dropdown",
        required: true,
        options: [
            { label: "Viewer", value: "viewer" },
            { label: "Commenter", value: "commenter" },
            { label: "Editor", value: "editor" },
        ],
    },
];

// ─────────────────────────────────────────────
//  Helper Functions
// ─────────────────────────────────────────────

export function getStatusMeta(status) {
    switch (status) {
        case "live":
            return { label: "Live", variant: "success" };
        case "processing":
            return { label: "Processing", variant: "high" };
        case "ready":
            return { label: "Ready", variant: "default" };
        case "failed":
            return { label: "Failed", variant: "critical" };
        case "scheduled":
        default:
            return { label: "Scheduled", variant: "medium" };
    }
}

export function getVisibilityMeta(visibility) {
    switch (visibility) {
        case "private":
            return { label: "Private", variant: "high", icon: Lock };
        case "restricted":
            return { label: "Restricted", variant: "medium", icon: Shield };
        case "public":
        default:
            return { label: "Public", variant: "success", icon: Globe };
    }
}

export function getParticipantRoleMeta(role) {
    switch (role) {
        case "editor":
            return { label: "Editor", variant: "success" };
        case "commenter":
            return { label: "Commenter", variant: "medium" };
        case "viewer":
        default:
            return { label: "Viewer", variant: "default" };
    }
}

export function formatDateTime(value, fallback = "Not scheduled") {
    if (!value) return fallback;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function toDateTimeLocalValue(value) {
    if (!value) return "";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

