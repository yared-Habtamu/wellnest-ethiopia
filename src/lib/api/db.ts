import { supabase } from "../supabase";

// ----------------------------------------------------------------------------
// PROFILES API
// ----------------------------------------------------------------------------
export const profileApi = {
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (error) throw error;
    return data;
  },
  async updateProfile(updates: { full_name?: string; language?: string; camouflage_enabled?: boolean; notifications_enabled?: boolean }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single();
    if (error) throw error;
    return data;
  }
};

// ----------------------------------------------------------------------------
// JOURNAL ENTRIES API
// ----------------------------------------------------------------------------
export const journalApi = {
  async getAll() {
    const { data, error } = await supabase.from("journal_entries").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(entry: { content: string; mode?: "text" | "voice"; duration_seconds?: number }) {
    const { data, error } = await supabase.from("journal_entries").insert([entry]).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from("journal_entries").delete().eq("id", id);
    if (error) throw error;
  }
};

// ----------------------------------------------------------------------------
// MOOD LOGS API
// ----------------------------------------------------------------------------
export const moodApi = {
  async getAll() {
    const { data, error } = await supabase.from("mood_logs").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(log: { score: number; note?: string }) {
    const { data, error } = await supabase.from("mood_logs").insert([log]).select().single();
    if (error) throw error;
    return data;
  }
};

// ----------------------------------------------------------------------------
// NUTRITION LOGS API
// ----------------------------------------------------------------------------
export const nutritionApi = {
  async getAll() {
    const { data, error } = await supabase.from("nutrition_logs").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(log: { meal_name: string; kcal?: number; protein?: number; carbs?: number; fat?: number; image_path?: string }) {
    const { data, error } = await supabase.from("nutrition_logs").insert([log]).select().single();
    if (error) throw error;
    return data;
  }
};

// ----------------------------------------------------------------------------
// CYCLE LOGS API
// ----------------------------------------------------------------------------
export const cycleApi = {
  async getAll() {
    const { data, error } = await supabase.from("cycle_logs").select("*").order("logged_date", { ascending: false });
    if (error) throw error;
    return data;
  },
  async logToday(flow_intensity: "Light" | "Medium" | "Heavy" | "Spotting" | "None") {
    // We use upsert so the user can change their logged flow for the day without duplicating rows
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase.from("cycle_logs")
      .upsert({ user_id: user.id, logged_date: today, flow_intensity }, { onConflict: "user_id, logged_date" })
      .select().single();
    
    if (error) throw error;
    return data;
  }
};

// ----------------------------------------------------------------------------
// SYMPTOM LOGS API
// ----------------------------------------------------------------------------
export const symptomApi = {
  async getAll() {
    const { data, error } = await supabase.from("symptom_logs").select("*").order("logged_date", { ascending: false });
    if (error) throw error;
    return data;
  },
  async logToday(symptoms: string[], intensity: number, note?: string) {
    const { data, error } = await supabase.from("symptom_logs")
      .insert([{ symptoms, intensity, note }])
      .select().single();
    if (error) throw error;
    return data;
  }
};

// ----------------------------------------------------------------------------
// GROUNDING SESSIONS API
// ----------------------------------------------------------------------------
export const groundingApi = {
  async logSession(duration_seconds: number) {
    const { data, error } = await supabase.from("grounding_sessions").insert([{ duration_seconds }]).select().single();
    if (error) throw error;
    return data;
  }
};

// ----------------------------------------------------------------------------
// SISTERHOOD COMMUNITY API
// ----------------------------------------------------------------------------
export const communityApi = {
  async getPosts() {
    // Because RLS is set up, this will automatically fetch all posts for authenticated users
    const { data, error } = await supabase.from("community_posts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async createPost(post: { tag: string; content: string; is_anonymous: boolean }) {
    const { data, error } = await supabase.from("community_posts").insert([post]).select().single();
    if (error) throw error;
    return data;
  },
  async likePost(id: string, currentLikes: number) {
    const { data, error } = await supabase.from("community_posts").update({ likes_count: currentLikes + 1 }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },
  async deletePost(id: string) {
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) throw error;
  }
};

// ----------------------------------------------------------------------------
// GAMIFICATION BADGES API
// ----------------------------------------------------------------------------
export const gamificationApi = {
  async getAvailableBadges() {
    const { data, error } = await supabase.from("badges").select("*");
    if (error) throw error;
    return data;
  },
  async getUserBadges() {
    const { data, error } = await supabase.from("user_badges").select("*, badges(*)");
    if (error) throw error;
    return data;
  }
};
