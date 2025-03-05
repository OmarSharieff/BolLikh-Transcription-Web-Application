import supabase from '../config/supabase.js';
import deepgram from '../config/deepgram.js';

export const createTranscription = async (userId, title, audioBuffer, duration) => {
  try {
    console.log('Received audio buffer size:', audioBuffer.length);

    // ✅ Send raw buffer to Deepgram
    const response = await deepgram.listen.prerecorded.transcribeFile(
      {
        stream: audioBuffer, // ✅ Send raw audio buffer
        mimetype: 'audio/wav',
      },
      {
        smart_format: true,
        punctuate: true,
        diarize: true,
      }
    );

    console.log('Deepgram API Response:', JSON.stringify(response, null, 2));

    if (!response.results || !response.results.channels) {
      throw new Error('Unexpected response from Deepgram API');
    }

    const transcript = response.results.channels[0].alternatives[0].transcript;

    // Save transcription to database
    const { data, error } = await supabase
      .from('transcriptions')
      .insert([
        {
          user_id: userId,
          title,
          transcript,
          duration,
          api_used: 'deepgram',
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  } catch (error) {
    console.error('Deepgram Transcription Error:', error.message);
    throw new Error('Deepgram API failed: ' + error.message);
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