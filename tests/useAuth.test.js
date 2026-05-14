import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../src/hooks/useAuth';
import * as authService from '../src/service/api';

vi.mock('../src/service/api', () => ({
  auth: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn(() => ({
    sub: 'user-1',
    role: 'admin',
  })),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('starts with loading true and restores session on mount', async () => {
    authService.auth.mockResolvedValueOnce({
      success: true,
      accessToken: 'token123',
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(authService.auth).toHaveBeenCalledWith('refresh', {});
    expect(result.current.accessToken).toBe('token123');
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.currentUser).toEqual({
      id: 'user-1',
      role: 'admin',
      isAdmin: true,
    });
    expect(sessionStorage.getItem('token')).toBe('token123');
  });

  it('keeps user logged out when refresh fails', async () => {
    authService.auth.mockResolvedValueOnce({
      success: false,
      error: 'No active session',
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.currentUser).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it('logs in successfully and updates auth state', async () => {
    authService.auth
      .mockResolvedValueOnce({
        success: false,
        error: 'No active session',
      })
      .mockResolvedValueOnce({
        success: true,
        accessToken: 'login-token',
      });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let loginResult;

    await act(async () => {
      loginResult = await result.current.login('admin', 'password');
    });

    expect(authService.auth).toHaveBeenCalledWith('login', {
      username: 'admin',
      password: 'password',
    });

    expect(loginResult).toEqual({ success: true });
    expect(result.current.accessToken).toBe('login-token');
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(sessionStorage.getItem('token')).toBe('login-token');
  });

  it('sets error when login fails', async () => {
    authService.auth
      .mockResolvedValueOnce({
        success: false,
        error: 'No active session',
      })
      .mockResolvedValueOnce({
        success: false,
        error: 'Invalid credentials',
      });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let loginResult;

    await act(async () => {
      loginResult = await result.current.login('admin', 'wrong');
    });

    expect(loginResult).toEqual({
      success: false,
      error: 'Invalid credentials',
    });
    expect(result.current.error).toBe('Invalid credentials');
    expect(result.current.isLoggedIn).toBe(false);
  });

  it('signs up successfully and updates auth state', async () => {
    authService.auth
      .mockResolvedValueOnce({
        success: false,
        error: 'No active session',
      })
      .mockResolvedValueOnce({
        success: true,
        accessToken: 'signup-token',
      });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let signupResult;

    await act(async () => {
      signupResult = await result.current.signup('newuser', 'password123');
    });

    expect(authService.auth).toHaveBeenCalledWith('signup', {
      username: 'newuser',
      password: 'password123',
    });

    expect(signupResult).toEqual({ success: true });
    expect(result.current.accessToken).toBe('signup-token');
    expect(result.current.isLoggedIn).toBe(true);
    expect(sessionStorage.getItem('token')).toBe('signup-token');
  });

  it('sets error when signup fails', async () => {
    authService.auth
      .mockResolvedValueOnce({
        success: false,
        error: 'No active session',
      })
      .mockResolvedValueOnce({
        success: false,
        error: 'Username already exists',
      });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let signupResult;

    await act(async () => {
      signupResult = await result.current.signup('admin', 'password123');
    });

    expect(signupResult).toEqual({
      success: false,
      error: 'Username already exists',
    });
    expect(result.current.error).toBe('Username already exists');
    expect(result.current.isLoggedIn).toBe(false);
  });

  it('logs out and clears auth state', async () => {
    authService.auth.mockResolvedValueOnce({
      success: true,
      accessToken: 'token123',
    });

    authService.logout.mockResolvedValueOnce({
      success: true,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(true);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(result.current.currentUser).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isAdmin).toBe(false);
    expect(sessionStorage.getItem('token')).toBeNull();
  });
});