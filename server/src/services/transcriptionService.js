import supabase from '../config/supabase.js';
import { assemblyAI } from '../config/assemblyai.js';

export const createTranscription = async (userId, title, audioBuffer, duration) => {
  try {
    console.log('🔹 Received audio buffer size:', audioBuffer.length);

    // Send audio buffer to AssemblyAI for transcription
    console.log('🔹 Sending audio to AssemblyAI for transcription...');
    const transcript = await assemblyAI.transcripts.transcribe({
      audio: audioBuffer,
    });

    if (!transcript.text) {
      throw new Error('AssemblyAI returned an empty transcription.');
    }

    console.log('✅ AssemblyAI Transcription:', transcript.text);

    // Save transcription to database
    const { data, error } = await supabase
      .from('transcriptions')
      .insert([
        {
          user_id: userId,
          title,
          transcript: transcript.text,
          api_used: 'assemblyai',
          duration,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  } catch (error) {
    console.error('❌ AssemblyAI Transcription Error:', error.message);
    throw new Error('AssemblyAI API failed: ' + error.message);
  }
};

export const getTranscriptions = async (userId) => {
  const { data, error } = await supabase
    .from('transcriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getTranscriptionById = async (id, userId) => {
  const { data, error } = await supabase
    .from('transcriptions')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateTranscription = async (id, userId, updates) => {
  const { data, error } = await supabase
    .from('transcriptions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

export const deleteTranscription = async (id, userId) => {
  const { error } = await supabase
    .from('transcriptions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }
};