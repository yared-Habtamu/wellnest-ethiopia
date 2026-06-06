import { createClient } from "@supabase/supabase-js";
import process from "node:process";
import fs from "node:fs";

function getEnv(key: string): string {
  if (process.env[key]) return process.env[key] as string;
  try {
    const envContent = fs.readFileSync(".env", "utf-8");
    const match = envContent.match(new RegExp(`^${key}=(.*)$`, "m"));
    if (match) return match[1];
  } catch (e) {
    // ignore
  }
  return "";
}

/**
 * Creates a secure, server-side Supabase client initialized with the user's JWT access token.
 * This ensures Row Level Security (RLS) is applied to all server-side queries.
 */
export function getServerSupabase(token: string) {
  const url = getEnv("VITE_SUPABASE_URL");
  const key = getEnv("VITE_SUPABASE_ANON_KEY");
  
  if (!url || !key) {
    throw new Error("Supabase URL and Key must be defined");
  }

  return createClient(url, key, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
}
