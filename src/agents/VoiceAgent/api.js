import { apiConfig } from "../../config/apiConfig";

const API_BASE_URL = apiConfig.voiceApiBaseUrl;

export function getToken() {
  return localStorage.getItem("access_token");
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  // Check whether the request body is FormData
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(options.headers || {}),
  };

  // ---------------------------------------------------------
  // IMPORTANT:
  // For FormData, DO NOT set Content-Type manually.
  // The browser automatically adds:
  // multipart/form-data; boundary=....
  // ---------------------------------------------------------

  if (!isFormData && options.body) {
    headers["Content-Type"] = "application/json";
  }

  // ---------------------------------------------------------
  // AUTHORIZATION
  // ---------------------------------------------------------

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // ---------------------------------------------------------
  // REQUEST
  // ---------------------------------------------------------

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // ---------------------------------------------------------
  // RESPONSE
  // ---------------------------------------------------------

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // ---------------------------------------------------------
  // ERROR HANDLING
  // ---------------------------------------------------------

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Not authenticated");
    }

    throw new Error(
      data?.detail ||
        data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`,
    );
  }

  return data;
}

export { API_BASE_URL };
