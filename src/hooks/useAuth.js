import { useState, useEffect, useCallback } from "react";
import * as authService from "../service/api";
import { jwtDecode } from "jwt-decode";

// auth context hook for managing authentication state and session persistence
export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


// helper to decode token and update user state
  const handleUserData = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      // 'sub' is the userId, 'role' is admin/user from the backend
      setCurrentUser({ 
        id: decoded.sub, 
        role: decoded.role,
        isAdmin: decoded.role === 'admin' 
      });
      setAccessToken(token);
      sessionStorage.setItem("token", token);
    } catch (err) {
      console.error("Invalid token format");
    }
  }, []);


  // try to restore session on mount using the backend's /refresh endpoint
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // the browser automatically sends the http-only 'jwt' cookie
        const result = await authService.auth("refresh", {});
        if (result.success) {
        handleUserData(result.accessToken);
        setError(null);  
        }
       
      } catch (err) {
        // no valid session found, user remains logged out
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [handleUserData]);

  // handles user login and sets the access token
  const handleLogin = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    const result = await authService.auth("login", { username, password });

    if (result.success) {
      handleUserData(result.accessToken);
      setLoading(false);
      return { success: true };
    } else {
      setError(result.error);
      setLoading(false);
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
      handleUserData(result.accessToken);
      setLoading(false);
      return { success: true };
    } else {
      setError(result.error);
      setLoading(false);
      return { success: false, error: result.error };
    }
  }, [handleUserData]);

  // handles user logout and clears both server-side and client-side state
  const handleLogout = useCallback(async () => {
    setLoading(true);
    // notify backend to revoke the refresh token and clear the cookie
    await authService.logout();
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
    isAdmin: currentUser?.isAdmin || false

  };
}
