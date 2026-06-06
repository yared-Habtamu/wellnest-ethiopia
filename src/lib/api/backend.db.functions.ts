import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerSupabase } from "../supabase.server";

// Base validator requiring auth token
const authSchema = z.object({
  token: z.string().min(1, "Authentication token required")
});

// Helper to get authenticated user and client
async function getAuthContext(token: string) {
  const supabase = getServerSupabase(token);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Invalid or expired session");
  }
  return { supabase, user };
}

// ----------------------------------------------------------------------------
// JOURNAL ENTRIES
// ----------------------------------------------------------------------------
export const getJournalEntriesFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema)
  .handler(async ({ data }) => {
    const { supabase } = await getAuthContext(data.token);
    const { data: result, error } = await supabase.from("journal_entries").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return result;
  });

export const createJournalEntryFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema.extend({
    content: z.string(),
    mode: z.enum(["text", "voice"]).optional(),
    duration_seconds: z.number().optional()
  }))
  .handler(async ({ data }) => {
    const { supabase, user } = await getAuthContext(data.token);
    const { token, ...payload } = data;
    
    const { data: result, error } = await supabase.from("journal_entries")
      .insert([{ ...payload, user_id: user.id }])
      .select().single();
      
    if (error) throw new Error(error.message);
    return result;
  });

// ----------------------------------------------------------------------------
// MOOD LOGS
// ----------------------------------------------------------------------------
export const getMoodLogsFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema)
  .handler(async ({ data }) => {
    const { supabase } = await getAuthContext(data.token);
    const { data: result, error } = await supabase.from("mood_logs").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return result;
  });

export const createMoodLogFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema.extend({
    score: z.number().min(1).max(5),
    note: z.string().optional()
  }))
  .handler(async ({ data }) => {
    const { supabase, user } = await getAuthContext(data.token);
    const { token, ...payload } = data;
    
    const { data: result, error } = await supabase.from("mood_logs")
      .insert([{ ...payload, user_id: user.id }])
      .select().single();
      
    if (error) throw new Error(error.message);
    return result;
  });

// ----------------------------------------------------------------------------
// CYCLE TRACKING
// ----------------------------------------------------------------------------
export const logCycleFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema.extend({
    flow_intensity: z.enum(["Light", "Medium", "Heavy", "Spotting", "None"])
  }))
  .handler(async ({ data }) => {
    const { supabase, user } = await getAuthContext(data.token);
    const today = new Date().toISOString().split('T')[0];
    
    const { data: result, error } = await supabase.from("cycle_logs")
      .upsert({ user_id: user.id, logged_date: today, flow_intensity: data.flow_intensity }, { onConflict: "user_id, logged_date" })
      .select().single();
      
    if (error) throw new Error(error.message);
    return result;
  });

// ----------------------------------------------------------------------------
// SYMPTOMS
// ----------------------------------------------------------------------------
export const logSymptomsFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema.extend({
    symptoms: z.array(z.string()),
    intensity: z.number().min(1).max(5),
    note: z.string().optional()
  }))
  .handler(async ({ data }) => {
    const { supabase, user } = await getAuthContext(data.token);
    const { token, ...payload } = data;
    const today = new Date().toISOString().split('T')[0];
    
    const { data: result, error } = await supabase.from("symptom_logs")
      .insert([{ ...payload, user_id: user.id, logged_date: today }])
      .select().single();
      
    if (error) throw new Error(error.message);
    return result;
  });

// ----------------------------------------------------------------------------
// COMMUNITY POSTS
// ----------------------------------------------------------------------------
export const getCommunityPostsFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema)
  .handler(async ({ data }) => {
    const { supabase } = await getAuthContext(data.token);
    const { data: result, error } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return result;
  });

export const createCommunityPostFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema.extend({
    tag: z.string(),
    content: z.string(),
    is_anonymous: z.boolean()
  }))
  .handler(async ({ data }) => {
    const { supabase, user } = await getAuthContext(data.token);
    const { token, ...payload } = data;
    
    const { data: result, error } = await supabase.from("community_posts")
      .insert([{ ...payload, user_id: user.id }])
      .select().single();
      
    if (error) throw new Error(error.message);
    return result;
  });

export const likeCommunityPostFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema.extend({
    id: z.string(),
    current_likes: z.number()
  }))
  .handler(async ({ data }) => {
    const { supabase } = await getAuthContext(data.token);
    
    const { data: result, error } = await supabase.from("community_posts")
      .update({ likes_count: data.current_likes + 1 })
      .eq("id", data.id)
      .select().single();
      
    if (error) throw new Error(error.message);
    return result;
  });

// ----------------------------------------------------------------------------
// NUTRITION LOGS
// ----------------------------------------------------------------------------
export const createNutritionLogFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema.extend({
    meal_name: z.string(),
    kcal: z.number().optional(),
    protein: z.number().optional(),
    carbs: z.number().optional(),
    fat: z.number().optional(),
  }))
  .handler(async ({ data }) => {
    const { supabase, user } = await getAuthContext(data.token);
    const { token, ...payload } = data;
    
    const { data: result, error } = await supabase.from("nutrition_logs")
      .insert([{ ...payload, user_id: user.id }])
      .select().single();
      
    if (error) throw new Error(error.message);
    return result;
  });

// ----------------------------------------------------------------------------
// PROFILE
// ----------------------------------------------------------------------------
export const updateProfileFn = createServerFn({ method: "POST" })
  .inputValidator(authSchema.extend({
    full_name: z.string().optional(),
    language: z.string().optional(),
    camouflage_enabled: z.boolean().optional(),
    notifications_enabled: z.boolean().optional(),
  }))
  .handler(async ({ data }) => {
    const { supabase, user } = await getAuthContext(data.token);
    const { token, ...payload } = data;
    
    const { data: result, error } = await supabase.from("profiles")
      .update(payload)
      .eq("id", user.id)
      .select().single();
      
    if (error) throw new Error(error.message);
    return result;
  });
