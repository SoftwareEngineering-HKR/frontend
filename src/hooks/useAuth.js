import { useState, useEffect, useCallback } from "react";
import * as authService from "../services/authService";
import {
  isTokenExpiringSoon,
  getUserFromToken,
  decodeToken,
} from "../services/tokenService";

// Auth context hook for managing authentication state and API calls
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Try to restore session from refresh token cookie on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Check if we have a refresh token cookie by attempting to refresh
        const result = await authService.refreshToken();
        if (result.success) {
          setAccessToken(result.accessToken);
          const user = getUserFromToken(result.accessToken);
          setCurrentUser(user);
          setError(null);
        }
      } catch (err) {
        console.log("No existing session to restore");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Handle token refresh when it's expiring soon
  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    if (isTokenExpiringSoon(accessToken)) {
      const refreshTokenFormatically = async () => {
        try {
          const result = await authService.refreshToken();
          if (result.success) {
            setAccessToken(result.accessToken);
            setError(null);
          } else {
            // Refresh failed, logout user
            handleLogout();
            setError("Session expired. Please login again.");
          }
        } catch (err) {
          handleLogout();
          setError("Failed to refresh session");
        }
      };

      refreshTokenFormatically();
    }

    setLoading(false);
  }, [accessToken]);

  const handleLogin = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    const result = await authService.login(username, password);

    if (result.success) {
      setAccessToken(result.accessToken);
      const user = getUserFromToken(result.accessToken);
      setCurrentUser(user);
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  const handleSignup = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    const result = await authService.signup(username, password);

    if (result.success) {
      setAccessToken(result.accessToken);
      const user = getUserFromToken(result.accessToken);
      setCurrentUser(user);
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Call logout endpoint to clear refresh token from backend
    await authService.logout(accessToken);

    // Clear local state
    setAccessToken(null);
    setCurrentUser(null);
    setLoading(false);
  }, [accessToken]);

  return {
    currentUser,
    accessToken,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isLoggedIn: !!currentUser && !!accessToken,
  };
}
