// src/store/authStore.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/types";

// --------------------------------------------------
// Helpers
// --------------------------------------------------
function mapUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    character: row.character,
    preferences: row.preferences,
    createdAt: row.created_at,
    personality: row.personality,
  };
}

function buildDefaultProfile(authUser: SupabaseUser) {
  return {
    id: authUser.id,
    email: authUser.email,
    username: authUser.email?.split("@")[0] ?? "",
    character: {
      name: "Hunter",
      avatar: "warrior",
      theme: "blue",
      level: 1,
      xp: 0,
      totalXP: 0,
      rank: "E",
    },
    preferences: {
      notifications: true,
      soundEffects: true,
      penalties: false,
      darkMode: true,
    },
    personality: "general",
  };
}

async function fetchOrCreateProfile(authUser: SupabaseUser) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  if (data) return data;

  const defaultProfile = buildDefaultProfile(authUser);

  const { data: inserted, error: insertError } = await supabase
    .from("users")
    .insert(defaultProfile)
    .select()
    .single();

  if (insertError) throw insertError;
  return inserted;
}

// --------------------------------------------------
// Store
// --------------------------------------------------
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  // Only runs once on app start
  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data?.session ?? null;

      if (session?.user) {
        const profile = await fetchOrCreateProfile(session.user);
        set({ session, user: mapUser(profile), initialized: true });
        return;
      }

      set({ initialized: true });
    } catch (err) {
      console.error("Initialize error:", err);
      set({ initialized: true });
    }
  },

  updateUser: async (updates) => {
  const { user } = get();
  if (!user) return;

  set({ loading: true });
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    set({ user: mapUserFromDb(data) });
  } finally {
    set({ loading: false });
  }
},

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("confirm")) {
          throw new Error("EMAIL_NOT_CONFIRMED");
        }
        throw error;
      }

      const session = data.session!;
      const profile = await fetchOrCreateProfile(session.user);

      set({
        session,
        user: mapUser(profile),
      });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (!data.session) {
        throw new Error("EMAIL_CONFIRMATION_REQUIRED");
      }

      const profile = await fetchOrCreateProfile(data.session.user);

      set({
        session: data.session,
        user: mapUser(profile),
      });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
function mapUserFromDb(data: any): User {
  return mapUser(data);
}

