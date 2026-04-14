export const SUPER_ADMIN_OPTIONS = [
    { label: "No — Regular User", value: false },
    { label: "Yes — Super Admin", value: true },
];

export const USER_CREATE_FIELDS = [
    {
        key: "full_name",
        type: "text",
        label: "Full Name",
        placeholder: "e.g. Jane Doe",
        required: true,
        col: "left",
    },
    {
        key: "email",
        type: "email",
        label: "Email",
        placeholder: "e.g. jane@meet.ai",
        required: true,
        col: "left",
    },
    {
        key: "password",
        type: "password",
        label: "Password",
        placeholder: "Minimum 8 characters",
        required: true,
        col: "left",
    },
    {
        key: "is_super_admin",
        type: "dropdown",
        label: "Super Admin",
        required: true,
        options: SUPER_ADMIN_OPTIONS,
        col: "left",
    },
];

export const FILTER_OPTIONS = [
    { key: "all", label: "All Status", is_active: null },
    { key: "active", label: "Active", is_active: true },
    { key: "inactive", label: "Inactive", is_active: false },
];

export const ADMIN_FILTER_OPTIONS = [
    { key: "all", label: "All Types", is_super_admin: null },
    { key: "admin", label: "Super Admins", is_super_admin: true },
    { key: "user", label: "Regular Users", is_super_admin: false },
];

export function formatUserStatusLabel(user) {
    if (user.deleted_at) return "Deleted";
    return user.is_active ? "Active" : "Inactive";
}

export function getUserStatusVariant(user) {
    if (user.deleted_at) return "critical";
    return user.is_active ? "success" : "default";
}

export function formatToggleMessage(isActive) {
    return isActive ? "User has been activated" : "User has been deactivated";
}