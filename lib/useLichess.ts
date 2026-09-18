'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { track } from '@vercel/analytics';
import { LichessUser } from './lichess';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'chessz_lichess_user_cache';

export function useLichess() {
  const [user, setUser] = useState<LichessUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef<boolean>(true);
  // Which Lichess username the Supabase session is currently linked to, so a
  // second fetchSession (a tab focus, a refresh) doesn't re-request a session
  // that's already correct.
  const linkedUsernameRef = useRef<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Lichess IS the login: once a real OAuth connection is confirmed (not a
  // public-username preview), silently bridge it into a Supabase session keyed
  // to that Lichess identity. The player never sees an email or password --
  // reconnecting Lichess on any device lands in the same Supabase user, so
  // their saved blunder library follows the connection rather than the
  // browser. If Supabase or the server-side secrets aren't configured, this is
  // a no-op and saves simply stay local to the browser.
  const linkSupabaseSession = useCallback(async (username: string) => {
    if (!isSupabaseConfigured || !supabase) return;
    const normalized = username.toLowerCase();
    if (linkedUsernameRef.current === normalized) return;
    try {
      const res = await fetch('/api/auth/lichess/session', { method: 'POST' });
      if (!res.ok) return;
      const data = await res.json();
      if (data.linked && data.access_token && data.refresh_token) {
        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        linkedUsernameRef.current = normalized;
      }
    } catch (err) {
      console.warn('Lichess-linked login skipped:', err);
    }
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
          // Only a real OAuth connection logs in; a public-username preview
          // (authenticated: false) never creates or claims an account.
          if (data.authenticated && data.user.username) {
            linkSupabaseSession(data.user.username);
          }
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
    } catch (err: unknown) {
      console.error('Failed fetching Lichess session:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error fetching session');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [linkSupabaseSession]);

  useEffect(() => {
    // Schedule initial session check asynchronously to avoid cascading renders
    const timer = setTimeout(() => {
      fetchSession();
    }, 0);

    // Check if redirected from OAuth callback with success query param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('lichess_connected') === '1') {
        // Fires once per OAuth return; the param is stripped just below, and a
        // plain mount (cookie rehydration) never reaches here.
        track('lichess_connected');
        setTimeout(() => fetchSession(true), 0);
        // Clean URL query params cleanly without reloading
        const url = new URL(window.location.href);
        url.searchParams.delete('lichess_connected');
        url.searchParams.delete('username');
        window.history.replaceState({}, '', url.pathname + url.search);
      }
    }

    return () => clearTimeout(timer);
  }, [fetchSession]);

  const login = useCallback((returnUrl?: string) => {
    const target = returnUrl || (typeof window !== 'undefined' ? window.location.pathname : '/');
    // External OAuth route redirect
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
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
      linkedUsernameRef.current = null;
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.signOut();
        } catch {}
      }
    } catch (err: unknown) {
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
          track('lichess_connected');
          return true;
        }
      }
      if (isMountedRef.current) setError('Lichess user not found');
      return false;
    } catch (err: unknown) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error connecting to user');
      }
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
