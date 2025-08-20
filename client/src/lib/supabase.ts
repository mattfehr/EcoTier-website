// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helpful runtime guard:
if (!url || !anon) {
  // You can also console.log(import.meta.env) here to inspect what Vite sees.
  throw new Error(
    `Missing Supabase env vars. 
     Got VITE_SUPABASE_URL=${url ?? "undefined"}, 
     VITE_SUPABASE_ANON_KEY=${anon ? "(present)" : "undefined"}.
     Ensure they are set in client/.env and restart the dev server.`
  );
}

export const supabase = createClient(url, anon);
