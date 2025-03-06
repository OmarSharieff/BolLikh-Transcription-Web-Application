import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  getUser: async () => {
    try {
      set({ isLoading: true, error: null });

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        set({ user: null, isLoading: false });
        return;
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle(); // Prevents error if no profile exists

      if (profileError) {
        console.error('Profile fetch error:', profileError.message);
        set({ user: null, isLoading: false });
        return;
      }

      // If no profile exists, create one automatically
      if (!profile) {
        const { error: profileInsertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || '',
            },
          ]);

        if (profileInsertError) {
          console.error('Profile creation error:', profileInsertError.message);
        }
      }

      set({
        user: {
          id: session.user.id,
          email: session.user.email,
          full_name: profile?.full_name,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Error getting user:', error);
      set({ user: null, isLoading: false });
    }
  },

  signUp: async (email, password, fullName) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Create a profile for the user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
            },
          ]);

        if (profileError) {
          console.error('Profile creation error:', profileError.message);
        }

        await useAuthStore.getState().getUser(); // Fetch user profile after signup
      }

      set({ isLoading: false });
    } catch (error) {
      console.error('Error signing up:', error);
      set({ error: error?.message || 'Failed to create account', isLoading: false });
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Email not confirmed') {
          throw new Error('Please confirm your email address before signing in.');
        } else {
          throw error;
        }
      }

      if (data.user) {
        await useAuthStore.getState().getUser(); // Fetch user profile after login
      }

      set({ isLoading: false });
    } catch (error) {
      console.error('Error signing in:', error);
      set({ error: error?.message || 'Failed to sign in', isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ error: error?.message || 'Failed to sign out', isLoading: false });
    }
  },

  clearErrors: () => {
    set({ error: null });
  },
}));