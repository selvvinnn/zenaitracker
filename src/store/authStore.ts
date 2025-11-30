import { create } from 'zustand';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

function mapUserFromDb(userData: any): User {
  return {
    id: userData.id,
    email: userData.email,
    username: userData.username,
    character: userData.character,
    preferences: userData.preferences,
    createdAt: userData.created_at,
  };
}

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    set({ loading: true });
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl === 'your-supabase-url') {
        console.warn('Supabase not configured. Skipping auth initialization.');
        set({ initialized: true, loading: false });
        return;
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        set({ initialized: true, loading: false });
        return;
      }
      
      if (session?.user) {
        // Fetch user data from database
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          set({ session, initialized: true, loading: false });
          return;
        }

        if (userData) {
          set({ session, user: mapUserFromDb(userData), initialized: true, loading: false });
        } else {
          set({ session, initialized: true, loading: false });
        }
      } else {
        set({ initialized: true, loading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ initialized: true, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle email not confirmed error
        if (error.message.includes('email') && (error.message.includes('confirm') || error.message.includes('confirmed'))) {
          throw new Error('EMAIL_NOT_CONFIRMED');
        }
        throw error;
      }

      if (data.session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          // If user doesn't exist in database, create one
          const newUser = {
            id: data.session.user.id,
            email: data.session.user.email!,
            character: {
              name: 'Hunter',
              avatar: 'warrior',
              theme: 'blue',
              level: 1,
              xp: 0,
              totalXP: 0,
              rank: 'E',
            },
            preferences: {
              notifications: true,
              soundEffects: true,
              penalties: false,
              darkMode: true,
            },
          };

          const { data: createdUser, error: createError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();

          if (createError) {
            console.error('Error creating user:', createError);
            console.error('Error details:', JSON.stringify(createError, null, 2));
            // More detailed error message
            throw new Error(`Failed to create user profile: ${createError.message || 'Unknown error'}. Please check RLS policies and database setup.`);
          }

          if (createdUser) {
            set({ session: data.session, user: mapUserFromDb(createdUser), loading: false });
          }
        } else if (userData) {
          set({ session: data.session, user: mapUserFromDb(userData), loading: false });
        } else {
          set({ session: data.session, loading: false });
        }
      } else {
        set({ loading: false });
      }
    } catch (error: any) {
      if (error.message === 'EMAIL_NOT_CONFIRMED') {
        throw error;
      }
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // Handle email not confirmed error
        if (error.message.includes('email') && error.message.includes('confirm')) {
          throw new Error('EMAIL_NOT_CONFIRMED');
        }
        throw error;
      }

      // If email confirmation is required, session might be null
      if (data.session?.user) {
        // Create user record in database
        const newUser = {
          id: data.session.user.id,
          email: data.session.user.email!,
          character: {
            name: 'Hunter',
            avatar: 'warrior',
            theme: 'blue',
            level: 1,
            xp: 0,
            totalXP: 0,
            rank: 'E',
          },
          preferences: {
            notifications: true,
            soundEffects: true,
            penalties: false,
            darkMode: true,
          },
        };

        const { data: userData, error: dbError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        if (dbError) {
          console.error('Error creating user in signUp:', dbError);
          console.error('Error code:', dbError.code);
          console.error('Error message:', dbError.message);
          
          // If insert fails due to duplicate (user already exists), try to fetch it
          if (dbError.code === '23505') { // Unique violation
            const { data: existingUser } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.session.user.id)
              .single();
            
            if (existingUser) {
              const mappedUser: User = {
                id: existingUser.id,
                email: existingUser.email,
                username: existingUser.username,
                character: existingUser.character,
                preferences: existingUser.preferences,
                createdAt: existingUser.created_at,
              };
              set({ session: data.session, user: mappedUser });
              return; // Success, exit early
            }
          }
          
          // If it's an RLS policy error, provide helpful message
          if (dbError.code === '42501' || dbError.message?.includes('policy') || dbError.message?.includes('permission')) {
            throw new Error('Database permission error: Missing INSERT policy for users table. Please run the SQL in fix-user-insert-policy.sql in your Supabase SQL Editor.');
          }
          
          throw new Error(`Failed to create user profile: ${dbError.message || 'Unknown error'}. Error code: ${dbError.code || 'N/A'}`);
        }

        // Map database response to User type
        const mappedUser: User = {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          character: userData.character,
          preferences: userData.preferences,
          createdAt: userData.created_at,
        };

        set({ session: data.session, user: mappedUser });
      } else {
        // Email confirmation required - user needs to check their email
        throw new Error('EMAIL_CONFIRMATION_REQUIRED');
      }
    } catch (error: any) {
      if (error.message === 'EMAIL_NOT_CONFIRMED' || error.message === 'EMAIL_CONFIRMATION_REQUIRED') {
        throw error;
      }
      throw new Error(error.message || 'Failed to sign up');
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        set({ user: mapUserFromDb(data) });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user');
    } finally {
      set({ loading: false });
    }
  },
}));

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, session: null });
  } else if (event === 'SIGNED_IN' && session) {
      supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            useAuthStore.setState({ session, user: mapUserFromDb(data) });
          }
        });
  }
});

