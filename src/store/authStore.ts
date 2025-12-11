// src/store/authStore.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { User } from "@/types";

// --------------------------------------------------
// Helpers: Map DB → App
// --------------------------------------------------
function mapUserFromDb(row: any): User {
  return {
    id: row.id,
    email: row.email ?? null,
    username: row.username ?? null,

    character: row.character ?? {
      name: "Hunter",
      avatar: "warrior",
      theme: "blue",
      level: 1,
      xp: 0,
      totalXP: 0,
      rank: "E",
    },

    preferences: row.preferences ?? undefined,
    createdAt: row.created_at ?? undefined,
    personality: row.personality ?? "general",

    // Hydration fields
    hydrationTodayLitres: row.hydration_today_litres ?? 0,
    dailyHydrationGoal: row.daily_hydration_goal ?? 2.0,
    hydrationStreak: row.hydration_streak ?? 0,

    lastHydrationGoalCompleted: row.last_hydration_goal_completed
      ? new Date(row.last_hydration_goal_completed)
      : null,

    lastHydrationAck: row.last_hydration_ack
      ? new Date(row.last_hydration_ack)
      : null,
  };
}

// Default user row for DB insert
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

    hydration_today_litres: 0,
    daily_hydration_goal: 2.0,
    hydration_streak: 0,
    last_hydration_goal_completed: null,
    last_hydration_ack: null,
  };
}

// Fetch or create DB user profile
async function fetchOrCreateProfile(authUser: SupabaseUser) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  if (data) return data;

  const defaultProfile = buildDefaultProfile(authUser);

  const { data: inserted, error: insertErr } = await supabase
    .from("users")
    .insert(defaultProfile)
    .select()
    .single();

  if (insertErr) throw insertErr;
  return inserted;
}

// --------------------------------------------------
// Store interface
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

  addHydration: (amountLitres: number) => Promise<void>;
  incrementHydrationGoalStreak: () => Promise<void>;
}

// --------------------------------------------------
// STORE
// --------------------------------------------------
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  // -----------------------------------------------
  // INIT
  // -----------------------------------------------
  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const session = data?.session ?? null;

      if (session?.user) {
        const profile = await fetchOrCreateProfile(session.user);
        set({
          session,
          user: mapUserFromDb(profile),
          initialized: true,
        });
        return;
      }

      set({ initialized: true });
    } catch (err) {
      console.error("Initialize error:", err);
      set({ initialized: true });
    }
  },

  // -----------------------------------------------
  // Update user (camelCase → snake_case)
  // -----------------------------------------------
  updateUser: async (updates) => {
    const { user } = get();
    if (!user) return;

    set({ loading: true });

    try {
      const formatted: any = { ...updates };

      // camelCase → snake_case mapping
      if ("hydrationTodayLitres" in updates) {
        formatted.hydration_today_litres = updates.hydrationTodayLitres;
        delete formatted.hydrationTodayLitres;
      }
      if ("dailyHydrationGoal" in updates) {
        formatted.daily_hydration_goal = updates.dailyHydrationGoal;
        delete formatted.dailyHydrationGoal;
      }
      if ("hydrationStreak" in updates) {
        formatted.hydration_streak = updates.hydrationStreak;
        delete formatted.hydrationStreak;
      }
      if ("lastHydrationGoalCompleted" in updates) {
        formatted.last_hydration_goal_completed =
          updates.lastHydrationGoalCompleted instanceof Date
            ? updates.lastHydrationGoalCompleted.toISOString()
            : updates.lastHydrationGoalCompleted;
        delete formatted.lastHydrationGoalCompleted;
      }
      if ("lastHydrationAck" in updates) {
        formatted.last_hydration_ack =
          updates.lastHydrationAck instanceof Date
            ? updates.lastHydrationAck.toISOString()
            : updates.lastHydrationAck;
        delete formatted.lastHydrationAck;
      }

      const { data, error } = await supabase
        .from("users")
        .update(formatted)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      set({ user: mapUserFromDb(data) });

    } finally {
      set({ loading: false });
    }
  },

  // -----------------------------------------------
  // Add hydration - increases litres
  // -----------------------------------------------
  addHydration: async (amountLitres) => {
    const { user, updateUser, incrementHydrationGoalStreak } = get();
    if (!user) return;

    const today = new Date().toDateString();
    const lastAckDay = user.lastHydrationAck?.toDateString() ?? null;

    let litres = user.hydrationTodayLitres ?? 0;

    // If new day → reset litres
    if (lastAckDay !== today) {
      litres = 0;
    }

    const updatedLitres = litres + amountLitres;

    await updateUser({
      hydrationTodayLitres: updatedLitres,
      lastHydrationAck: new Date(),
    });
    const goal = user.dailyHydrationGoal ?? 2.0;
    // If hydration goal completed → streak++
    if (updatedLitres >= goal) {
      await incrementHydrationGoalStreak();
    }
  },

  // -----------------------------------------------
  // Streak increments once per day on goal completion
  // -----------------------------------------------
  incrementHydrationGoalStreak: async () => {
    const { user, updateUser } = get();
    if (!user) return;

    const today = new Date();
    const last = user.lastHydrationGoalCompleted;

    let streak = user.hydrationStreak ?? 0;

    if (!last) {
      streak = 1;
    } else {
      const lastDay = new Date(last);
      lastDay.setHours(0, 0, 0, 0);

      const todayMid = new Date(today);
      todayMid.setHours(0, 0, 0, 0);

      const diffDays =
        (todayMid.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 0) {
        // Already counted today → do nothing
        return;
      } else if (diffDays === 1) {
        streak += 1; // consecutive day
      } else {
        streak = 1; // broke streak
      }
    }

    // Award XP and update streak
    await updateUser({
      hydrationStreak: streak,
      lastHydrationGoalCompleted: today,
      character: {
        ...user.character,
        totalXP: (user.character.totalXP ?? 0) + 10,
      },
    });
  },

  // -----------------------------------------------
  // Auth
  // -----------------------------------------------
  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const session = data.session!;
      const profile = await fetchOrCreateProfile(session.user);

      set({
        session,
        user: mapUserFromDb(profile),
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

      if (!data.session) throw new Error("EMAIL_CONFIRMATION_REQUIRED");

      const profile = await fetchOrCreateProfile(data.session.user);

      set({
        session: data.session,
        user: mapUserFromDb(profile),
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
