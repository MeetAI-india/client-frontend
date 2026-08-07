const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_CONFIG = {
    BASE_URL: API_BASE_URL,

    ENDPOINTS: {
        LOGIN: "/auth/login",
        SIGNUP: "/auth/signup",
        REFRESH: "/auth/refresh",
        LOGOUT: "/auth/logout",
        ME: "/auth/me",
        PROJECTS: "/projects",
        USERS: "/users",
    },

    CSRF_COOKIE_NAME: "csrf_token",
    CSRF_HEADER_NAME: "X-CSRF-Token",
};
