import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { auth, logout, getData } from '../src/service/api';

describe('api.js', () => {
  beforeEach(() => {
    sessionStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('sends login request and stores token on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ accessToken: 'token123' }),
    });

    const result = await auth('login', {
      username: 'admin',
      password: 'password',
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: 'admin',
        password: 'password',
      }),
    });

    expect(result).toEqual({
      success: true,
      accessToken: 'token123',
    });
    expect(sessionStorage.getItem('token')).toBe('token123');
  });

  it('sends signup request and stores token on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ accessToken: 'signup-token' }),
    });

    const result = await auth('signup', {
      username: 'newuser',
      password: 'password123',
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/signup', expect.objectContaining({
      method: 'POST',
      credentials: 'include',
    }));

    expect(result.success).toBe(true);
    expect(result.accessToken).toBe('signup-token');
    expect(sessionStorage.getItem('token')).toBe('signup-token');
  });

  it('does not store token when auth fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    const result = await auth('login', {
      username: 'admin',
      password: 'wrong',
    });

    expect(result).toEqual({
      success: false,
      error: 'Invalid credentials',
    });
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('returns default auth error when server gives no message', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({}),
    });

    const result = await auth('login', {
      username: 'admin',
      password: 'wrong',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Auth failed');
  });

  it('returns proxy error when auth request fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await auth('login', {
      username: 'admin',
      password: 'password',
    });

    expect(result).toEqual({
      success: false,
      error: 'Proxy connection failed',
    });
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('logout sends token in Authorization header', async () => {
    sessionStorage.setItem('token', 'token123');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ message: 'Logged out' }),
    });

    const result = await logout();

    expect(global.fetch).toHaveBeenCalledWith('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer token123',
      },
      credentials: 'include',
    });

    expect(result).toEqual({ success: true });
  });

  it('returns logout error when logout fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Logout failed on server' }),
    });

    const result = await logout();

    expect(result).toEqual({
      success: false,
      error: 'Logout failed on server',
    });
  });

  it('returns logout error when request throws', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await logout();

    expect(result).toEqual({
      success: false,
      error: 'Logout failed',
    });
  });

  it('getData sends GET request with Bearer token', async () => {
    sessionStorage.setItem('token', 'token123');

    global.fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ data: 'ok' }),
    });

    const result = await getData('/devices');

    expect(global.fetch).toHaveBeenCalledWith('/api/devices', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer token123',
      },
      credentials: 'include',
    });

    expect(result).toEqual({ data: 'ok' });
  });

  it('refreshes token and retries getData after 401', async () => {
    sessionStorage.setItem('token', 'old-token');

    global.fetch
      .mockResolvedValueOnce({
        status: 401,
        json: async () => ({ message: 'Expired token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ accessToken: 'new-token' }),
      })
      .mockResolvedValueOnce({
        status: 200,
        json: async () => ({ data: 'success' }),
      });

    const result = await getData('/test');

    expect(result).toEqual({ data: 'success' });
    expect(sessionStorage.getItem('token')).toBe('new-token');

    expect(global.fetch).toHaveBeenNthCalledWith(1, '/api/test', expect.objectContaining({
      method: 'GET',
      headers: {
        Authorization: 'Bearer old-token',
      },
    }));

    expect(global.fetch).toHaveBeenNthCalledWith(2, '/api/refresh', expect.objectContaining({
      method: 'POST',
      credentials: 'include',
    }));

    expect(global.fetch).toHaveBeenNthCalledWith(3, '/api/test', expect.objectContaining({
      method: 'GET',
      headers: {
        Authorization: 'Bearer new-token',
      },
    }));
  });

  it('removes token and returns original 401 body when refresh fails', async () => {
    sessionStorage.setItem('token', 'old-token');

    const eventSpy = vi.spyOn(window, 'dispatchEvent');

    global.fetch
      .mockResolvedValueOnce({
        status: 401,
        json: async () => ({ message: 'Expired token' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Refresh failed' }),
      });

    const result = await getData('/test');

    expect(result).toEqual({ message: 'Expired token' });
    expect(sessionStorage.getItem('token')).toBeNull();
    expect(eventSpy).toHaveBeenCalled();
  });
});