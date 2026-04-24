
const API_BASE_URL = "/api";

// Flag to prevent concurrent refresh attempts
let isRefreshing = false;
let refreshPromise = null;

export async function auth(path, body) {
  try {
    console.log(`[API] POST /${path}`, body);
    const res = await fetch(`${API_BASE_URL}/${path}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      // required for backend Routes.js to set/read 'jwt' cookie
      credentials: "include", 
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    console.log(`[API] Response status: ${res.status}`, data);
    
    if (res.ok && data.accessToken) {
      sessionStorage.setItem("token", data.accessToken);
      return { success: true, accessToken: data.accessToken };
    }
    return { success: false, error: data.message || "Auth failed" };
  } catch (err) {
    console.error(`[API] Error:`, err);
    return { success: false, error: "Proxy connection failed" };
  }
}

export async function logout() {
  try {
    const token = sessionStorage.getItem("token");
    console.log(`[API] POST /logout`);
    const res = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      // required for backend to revoke the 'jwt' cookie
      credentials: "include"
    });
    
    const data = await res.json();
    console.log(`[API] Logout response status: ${res.status}`, data);
    
    if (res.ok) {
      return { success: true };
    }
    return { success: false, error: data.message || "Logout failed" };
  } catch (err) {
    console.error(`[API] Logout error:`, err);
    return { success: false, error: "Logout failed" };
  }
}

async function refreshAccessToken() {
  // If already refreshing, wait for the existing refresh to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      console.log("[API] Attempting token refresh...");
      const result = await auth("refresh", {});
      
      if (result.success) {
        console.log("[API] Token refreshed successfully");
        return result.accessToken;
      } else {
        console.error("[API] Token refresh failed:", result.error);
        // Refresh failed - logout and redirect
        sessionStorage.removeItem("token");
        // Trigger logout by reloading or dispatching an event
        window.dispatchEvent(new CustomEvent("logout-required"));
        throw new Error("Token refresh failed");
      }
    } finally {
      // Always reset the flags and promise when refresh completes (success or failure)
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function getData(path) {
  const token = sessionStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
    credentials: "include" 
  });

  // Handle 401 - token expired, attempt refresh
  if (res.status === 401) {
    console.log("[API] Received 401, attempting refresh...");
    try {
      const newToken = await refreshAccessToken();
      sessionStorage.setItem("token", newToken);
      
      // Retry the original request with the new token
      const retryRes = await fetch(`${API_BASE_URL}${path}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${newToken}` },
        credentials: "include"
      });
      return retryRes.json();
    } catch (err) {
      console.error("[API] Refresh and retry failed:", err);
      // Return the original 401 response
      return res.json();
    }
  }

  return res.json();
}