import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useTranscriptionStore = create((set, get) => ({
  transcriptions: [],
  currentTranscription: null,
  isLoading: false,
  error: null,

  fetchTranscriptions: async () => {
    try {
      set({ isLoading: true, error: null });

      // Fetch the current user's session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('No session found. Please log in.');
      }

      // Fetch transcriptions for the current user
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('user_id', session.user.id) // Filter by the current user's ID
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ transcriptions: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching transcriptions:', error);
      set({ error: error.message || 'Failed to fetch transcriptions', isLoading: false });
    }
  },

  getTranscription: async (id) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      set({ currentTranscription: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching transcription:', error);
      set({ error: error.message || 'Failed to fetch transcription', isLoading: false });
    }
  },

  createTranscription: async (title, transcript, apiUsed, duration) => {
    try {
      set({ isLoading: true, error: null });
  
      const { data: userData } = await supabase.auth.getUser();
  
      if (!userData.user) {
        throw new Error('User not authenticated');
      }
  
      const newTranscription = {
        title,
        transcript, // Changed from 'content' to 'transcript'
        api_used: apiUsed,
        user_id: userData.user.id,
        duration: duration || null,
      };
  
      const { data, error } = await supabase
        .from('transcriptions')
        .insert(newTranscription)
        .select()
        .single();
  
      if (error) throw error;
  
      const transcriptions = get().transcriptions;
      set({
        transcriptions: [data, ...transcriptions],
        isLoading: false,
      });
  
      return data;
    } catch (error) {
      console.error('Error creating transcription:', error);
      set({ error: error.message || 'Failed to create transcription', isLoading: false });
      return null;
    }
  },
  
  deleteTranscription: async (id) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const transcriptions = get().transcriptions.filter((t) => t.id !== id);
      set({ transcriptions, isLoading: false });
    } catch (error) {
      console.error('Error deleting transcription:', error);
      set({ error: error.message || 'Failed to delete transcription', isLoading: false });
    }
  },

  updateTranscription: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase
        .from('transcriptions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      const transcriptions = get().transcriptions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );

      set({
        transcriptions,
        currentTranscription: get().currentTranscription?.id === id
          ? { ...get().currentTranscription, ...updates }
          : get().currentTranscription,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error updating transcription:', error);
      set({ error: error.message || 'Failed to update transcription', isLoading: false });
    }
  },
}));