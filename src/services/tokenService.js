// Utility functions for managing JWT tokens

const TOKEN_REFRESH_BUFFER_MS = 60000; // Refresh token 1 minute before expiry

// Decode JWT payload (doesn't verify signature - for client-side use only)
export function decodeToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  return now >= expiryTime;
}

// Check if token is expiring soon (within buffer time)
export function isTokenExpiringSoon(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  return now >= expiryTime - TOKEN_REFRESH_BUFFER_MS;
}

// Get time until token expires (in milliseconds)
export function getTokenExpiryTime(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return 0;

  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  return Math.max(0, expiryTime - now);
}

// Extract user info from token
export function getUserFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    userId: decoded.sub,
    role: decoded.role,
    username: decoded.username,
  };
}
