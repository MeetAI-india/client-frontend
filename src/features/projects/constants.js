export const STATUS_OPTIONS = [
    { label: "Not Started", value: "not_started" },
    { label: "In Progress", value: "in_progress" },
    { label: "On Hold", value: "on_hold" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
];

export const MEMBER_ROLE_OPTIONS = [
    { label: "Admin", value: "admin" },
    { label: "Maintainer", value: "maintainer" },
    { label: "Member", value: "member" },
    { label: "Viewer", value: "viewer" },
];

export const PROJECT_FIELDS = [
    {
        key: "name",
        type: "text",
        label: "Project Name",
        placeholder: "e.g. MeetAI Dashboard Redesign",
        required: true,
        col: "left",
    },
    {
        key: "status",
        type: "dropdown",
        label: "Status",
        required: true,
        options: STATUS_OPTIONS,
        col: "left",
    },
    {
        key: "short_description",
        type: "textarea",
        label: "Short Description",
        placeholder: "A concise one or two line summary for project cards",
        rows: 3,
        col: "left",
    },
    {
        key: "deadline",
        type: "date",
        label: "Deadline",
        col: "left",
    },
    {
        key: "description",
        type: "markdown",
        label: "Description",
        placeholder: "What is this project about? What are the goals?\n\n**Supports** _markdown_",
        col: "right",
    },
];

export const formatStatusLabel = (status) => {
    switch (status) {
        case "not_started":
            return "Not Started";
        case "in_progress":
            return "In Progress";
        case "on_hold":
            return "On Hold";
        case "completed":
            return "Completed";
        case "cancelled":
            return "Cancelled";
        default:
            return status ?? "Unknown";
    }
};

export const formatRoleLabel = (role) => {
    if (!role) return "Unknown";
    return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ");
};