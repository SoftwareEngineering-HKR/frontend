const API_BASE_URL = "http://localhost:8081";

// Fetch wrapper that automatically includes Authorization header for protected endpoints
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = sessionStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Include cookies for refresh token
    });

    // If unauthorized, attempt token refresh and retry
    if (response.status === 401 && accessToken) {
      // Try to refresh token
      const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        sessionStorage.setItem("accessToken", refreshData.accessToken);

        // Retry original request with new token
        headers.Authorization = `Bearer ${refreshData.accessToken}`;
        return fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });
      }
    }

    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Convenience method for GET requests
export async function apiGet(endpoint, options = {}) {
  return apiFetch(endpoint, { ...options, method: "GET" });
}

// Convenience method for POST requests
export async function apiPost(endpoint, body, options = {}) {
  return apiFetch(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Convenience method for PUT requests
export async function apiPut(endpoint, body, options = {}) {
  return apiFetch(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// Convenience method for DELETE requests
export async function apiDelete(endpoint, options = {}) {
  return apiFetch(endpoint, { ...options, method: "DELETE" });
}
