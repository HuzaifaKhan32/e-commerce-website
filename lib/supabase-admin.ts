
import { createClient } from "@supabase/supabase-js";

// WARNING: This client has full admin access. Use only in server-side contexts.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
