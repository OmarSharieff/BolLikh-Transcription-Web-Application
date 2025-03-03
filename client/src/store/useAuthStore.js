import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  error: null,

  getUser: async () => {
    try {
      set({ isLoading: true, error: null });

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        set({ user: null, isLoading: false });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      set({
        user: {
          id: session.user.id,
          email: session.user.email,
          full_name: profile?.full_name,
          avatar_url: profile?.avatar_url,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Error getting user:', error);
      set({ error: 'Failed to get user', isLoading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            full_name: profile?.full_name,
            avatar_url: profile?.avatar_url,
          },
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      set({ error: error.message || 'Failed to sign in', isLoading: false });
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

      if (data.user) {
        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });

        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
          },
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      set({ error: error.message || 'Failed to sign up', isLoading: false });
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
      set({ error: error.message || 'Failed to sign out', isLoading: false });
    }
  },
}));
