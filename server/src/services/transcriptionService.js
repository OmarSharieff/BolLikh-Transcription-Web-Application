import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import deepgram from '../config/deepgram.js';
import supabase from '../lib/supabase.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Transcribe audio using Deepgram
const transcribeAudio = async (filePath) => {
  try {
    const transcription = await transcribeWithDeepgram(filePath);
    return transcription;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
};

// Transcribe with Deepgram v3 API
const transcribeWithDeepgram = async (filePath) => {
  try {
    const audio = fs.readFileSync(filePath);
    const mimetype = getMimeType(filePath);

    const source = {
      buffer: audio,
      mimetype: mimetype
    };

    const response = await deepgram.listen.prerecorded.transcribeFile(
      source,
      {
        smart_format: true,
        punctuate: true,
        diarize: true
      }
    );

    if (!response || !response.results || !response.results.channels || !response.results.channels[0]) {
      throw new Error('Invalid response from Deepgram API');
    }

    // Extract transcript from the response
    const transcript = response.results.channels[0].alternatives[0].transcript;
    return transcript;
  } catch (error) {
    console.error('Deepgram transcription error:', error);
    throw new Error(`Deepgram transcription failed: ${error.message}`);
  }
};

// Save transcription to database
const saveTranscription = async (userId, title, content, audioUrl, duration) => {
  try {
    const { data, error } = await supabase
      .from('transcriptions')
      .insert([
        {
          user_id: userId,
          title,
          content,
          api_used: 'deepgram',
          audio_url: audioUrl,
          duration
        }
      ])
      .select();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to save transcription: ${error.message}`);
    }

    return data[0];
  } catch (error) {
    console.error('Save transcription error:', error);
    throw new Error(`Failed to save transcription: ${error.message}`);
  }
};

// Get user transcriptions
const getUserTranscriptions = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to get transcriptions: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Get transcriptions error:', error);
    throw new Error(`Failed to get transcriptions: ${error.message}`);
  }
};

// Get single transcription
const getTranscription = async (transcriptionId, userId) => {
  try {
    const { data, error } = await supabase
      .from('transcriptions')
      .select('*')
      .eq('id', transcriptionId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to get transcription: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Get transcription error:', error);
    throw new Error(`Failed to get transcription: ${error.message}`);
  }
};

// Delete transcription
const deleteTranscription = async (transcriptionId, userId) => {
  try {
    // Get the transcription first to get the audio URL
    const transcription = await getTranscription(transcriptionId, userId);

    // Delete from database
    const { error } = await supabase
      .from('transcriptions')
      .delete()
      .eq('id', transcriptionId)
      .eq('user_id', userId);

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to delete transcription: ${error.message}`);
    }

    // Delete audio file
    if (transcription && transcription.audio_url) {
      try {
        const filePath = path.join(process.env.AUDIO_UPLOAD_DIR, path.basename(transcription.audio_url));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error('Error deleting audio file:', fileError);
        // Continue even if file deletion fails
      }
    }

    return true;
  } catch (error) {
    console.error('Delete transcription error:', error);
    throw new Error(`Failed to delete transcription: ${error.message}`);
  }
};

// Helper function to get MIME type based on file extension
const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.mp3':
      return 'audio/mpeg';
    case '.wav':
      return 'audio/wav';
    case '.ogg':
      return 'audio/ogg';
    case '.m4a':
      return 'audio/m4a';
    case '.flac':
      return 'audio/flac';
    default:
      return 'audio/mpeg'; // Default
  }
};

// Save audio file
const saveAudioFile = async (file) => {
  try {
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(process.env.AUDIO_UPLOAD_DIR, fileName);

    // Save the file
    fs.writeFileSync(filePath, file.buffer);

    // Return the file path
    return {
      filePath,
      fileName,
      fileUrl: `/uploads/${fileName}`
    };
  } catch (error) {
    console.error('Save audio file error:', error);
    throw new Error(`Failed to save audio file: ${error.message}`);
  }
};

export {
  transcribeAudio,
  saveTranscription,
  getUserTranscriptions,
  getTranscription,
  deleteTranscription,
  saveAudioFile
};