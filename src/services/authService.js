const API_BASE_URL = "http://localhost:8081";

// Login with username/password
export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      accessToken: data.accessToken,
      user: data.user, // May include username, role, etc.
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Signup with username/password
export async function signup(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Signup failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      accessToken: data.accessToken,
      user: data.user, // May include username, role, etc.
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Refresh access token using refresh token from cookie
export async function refreshToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies (refresh token)
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      accessToken: data.accessToken,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Logout - clears refresh token from backend
export async function logout(accessToken) {
  try {
    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
  // Don't throw - logout should always succeed from frontend perspective
  return { success: true };
}
