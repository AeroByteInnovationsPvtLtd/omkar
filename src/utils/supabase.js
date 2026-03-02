import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isBrowser = typeof window !== "undefined";

// Create a single shared client for browser usage to avoid multiple
// GoTrueClient instances which warn about using the same storage key.
const browserClient = isBrowser
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Returns a Supabase client. In the browser we always return the same
 * shared client to avoid multiple GoTrueClient instances. On the server
 * (Node) we create a short-lived client when a token is provided so we
 * can attach the Authorization header without mutating global auth state.
 */
const supabaseClient = async (supabaseAccessToken) => {
  if (!isBrowser) {
    // Server-side: create a client per-request so we can set headers safely.
    return createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: supabaseAccessToken
          ? { Authorization: `Bearer ${supabaseAccessToken}` }
          : {},
      },
    });
  }

  // Browser: reuse the same client. If a token is provided, set it on the
  // shared client so subsequent requests use it. setAuth is used when
  // available in the installed supabase client version.
  if (supabaseAccessToken && browserClient?.auth?.setAuth) {
    try {
      browserClient.auth.setAuth(supabaseAccessToken);
    } catch (e) {
      // If setting auth fails, silently continue with the shared client.
      console.warn("supabase: failed to set auth on shared client:", e);
    }
  }

  return browserClient;
};

export default supabaseClient;