import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { auth, logout, getData } from './api';

describe('api.js', () => {
  beforeEach(() => {
    sessionStorage.clear();
    global.fetch = vi.fn();
  });

  it('stores token on successful auth', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ accessToken: 'token123' }),
    });

    await auth('login', { username: 'u', password: 'p' });
    expect(sessionStorage.getItem('token')).toBe('token123');
  });

  it('handles 401 token refresh logic', async () => {
    global.fetch
      .mockResolvedValueOnce({ status: 401, json: async () => ({}) }) // Initial fail
      .mockResolvedValueOnce({ ok: true, json: async () => ({ accessToken: 'new_token' }) }) // Refresh
      .mockResolvedValueOnce({ status: 200, json: async () => ({ data: 'success' }) }); // Retry

    const result = await getData('/test');
    expect(result.data).toBe('success');
    expect(sessionStorage.getItem('token')).toBe('new_token');
  });
});