import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * Server-only. Bridges a verified Lichess OAuth identity into a real Supabase
 * account, deterministically and silently -- the player never sees an email
 * or password.
 *
 * Supabase has no native Lichess OAuth provider, so this uses the
 * email+password grant as a bridge: a synthetic email keyed to the Lichess
 * user id, and a password derived by HMAC from a server secret that never
 * leaves this file. Two devices that connect the same Lichess account derive
 * the same email and password and land in the same Supabase user -- which is
 * the point: the saved blunder library follows the Lichess connection, not
 * the browser.
 *
 * Only ever import this from a route handler, never from a 'use client' file
 * or anything a Client Component imports -- the service role key must not
 * reach the browser bundle.
 */

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ||
  '';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const authSecret = process.env.LICHESS_AUTH_SECRET || '';

/** False when the optional cross-device login is not set up; the rest of the
 *  app still works, saves just stay local to the browser. */
export const isLichessLoginConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && serviceRoleKey && authSecret
);

let adminClient: SupabaseClient | null = null;

/** Bypasses Row Level Security. Used only to create/upsert on the player's own row. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isLichessLoginConfigured) return null;
  if (!adminClient) {
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminClient;
}

/** A fresh client per request: auth calls must never share state across requests. */
export function createServerAuthClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function deriveLichessLoginEmail(lichessId: string): string {
  return `lichess-${lichessId.toLowerCase()}@id.chessz.internal`;
}

export function deriveLichessLoginPassword(lichessId: string): string {
  return crypto.createHmac('sha256', authSecret).update(lichessId.toLowerCase()).digest('hex');
}
