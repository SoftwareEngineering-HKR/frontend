import { useState, useEffect, useCallback } from "react";
import * as authService from "../service/api";

// auth context hook for managing authentication state and session persistence
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // try to restore session on mount using the backend's /refresh endpoint
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // the browser automatically sends the http-only 'jwt' cookie
        const result = await authService.auth("refresh", {});
        if (result.success) {
          setAccessToken(result.accessToken);
          // since tokenservice is removed, we flag the user as authenticated
          setCurrentUser({ authenticated: true });
          setError(null);
        }
      } catch (err) {
        // no valid session found, user remains logged out
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // handles user login and sets the access token
  const handleLogin = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    const result = await authService.auth("login", { username, password });

    if (result.success) {
      setAccessToken(result.accessToken);
      setCurrentUser({ username });
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  // handles user signup and sets the access token
  const handleSignup = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    // matching the backend usermodel.adduser requirements
    const result = await authService.auth("signup", { username, password });

    if (result.success) {
      setAccessToken(result.accessToken);
      setCurrentUser({ username });
      return { success: true };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  }, []);

  // handles user logout and clears both server-side and client-side state
  const handleLogout = useCallback(async () => {
    setLoading(true);
    setError(null);

    // notify backend to revoke the refresh token and clear the cookie
    await authService.auth("logout", {});

    // clear all local auth state
    setAccessToken(null);
    setCurrentUser(null);
    sessionStorage.removeItem("token");
    setLoading(false);
  }, []);

  return {
    currentUser,
    accessToken,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    isLoggedIn: !!accessToken,
  };
}
