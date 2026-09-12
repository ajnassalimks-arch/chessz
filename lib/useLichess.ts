'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { LichessUser } from './lichess';

const LOCAL_STORAGE_KEY = 'chessz_lichess_user_cache';

export function useLichess() {
  const [user, setUser] = useState<LichessUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load from session API and fallback to localStorage cache
  const fetchSession = useCallback(async (refresh: boolean = false) => {
    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }

      const res = await fetch(`/api/auth/lichess/me${refresh ? '?refresh=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          if (isMountedRef.current) {
            setUser(data.user);
            setIsAuthenticated(!!data.authenticated);
          }
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.user));
          } catch {}
          return;
        }
      }

      // If server returned no user, check local cache fallback
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (isMountedRef.current) {
            setUser(parsed);
            setIsAuthenticated(false);
          }
        } catch {}
      } else {
        if (isMountedRef.current) {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (err: any) {
      console.error('Failed fetching Lichess session:', err);
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSession();

    // Check if redirected from OAuth callback with success query param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('lichess_connected') === '1') {
        fetchSession(true);
        // Clean URL query params cleanly without reloading
        const url = new URL(window.location.href);
        url.searchParams.delete('lichess_connected');
        url.searchParams.delete('username');
        window.history.replaceState({}, '', url.pathname + url.search);
      }
    }
  }, [fetchSession]);

  const login = useCallback((returnUrl?: string) => {
    const target = returnUrl || (typeof window !== 'undefined' ? window.location.pathname : '/');
    window.location.href = `/api/auth/lichess/login?returnUrl=${encodeURIComponent(target)}`;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (isMountedRef.current) setLoading(true);
      await fetch('/api/auth/lichess/logout', { method: 'POST' });
      if (isMountedRef.current) {
        setUser(null);
        setIsAuthenticated(false);
      }
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {}
    } catch (err: any) {
      console.error('Failed to log out from Lichess:', err);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  const connectByUsername = useCallback(async (username: string): Promise<boolean> => {
    if (!username.trim()) return false;
    try {
      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }
      const res = await fetch(`/api/auth/lichess/me?username=${encodeURIComponent(username.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          if (isMountedRef.current) {
            setUser(data.user);
            setIsAuthenticated(false); // Public preview
          }
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.user));
          } catch {}
          return true;
        }
      }
      if (isMountedRef.current) setError('Lichess user not found');
      return false;
    } catch (err: any) {
      if (isMountedRef.current) setError(err.message);
      return false;
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refreshUser: () => fetchSession(true),
    connectByUsername,
  };
}
