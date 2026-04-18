import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for server-side use in API routes.
 * Optionally accepts an auth token to act on behalf of the logged-in user.
 */
export function createServerSupabase(authToken) {
  const options = {};

  if (authToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options
  );
}
