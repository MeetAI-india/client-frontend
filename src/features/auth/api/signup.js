import { apiClient } from "../../../config/api-client";
import { API_CONFIG } from "../../../config/api";

export function signupApi(payload) {
    return apiClient(API_CONFIG.ENDPOINTS.SIGNUP, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}