import { createClient } from "@supabase/supabase-js";

// Make sure to add these to your .env file:
// VITE_SUPABASE_URL=your_supabase_url
// VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// We export the initialized client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
