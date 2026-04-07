import { apiClient } from "../../../config/api-client";
import { API_CONFIG } from "../../../config/api";

export function getMe() {
    return apiClient(API_CONFIG.ENDPOINTS.ME, {
        method: "GET",
    });
}