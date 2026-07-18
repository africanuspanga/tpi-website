import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. Use ONLY in server actions or trusted server contexts.
 * Never expose this client or the service key to the browser.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
