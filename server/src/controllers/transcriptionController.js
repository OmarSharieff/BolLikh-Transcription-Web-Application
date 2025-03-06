import {
  createTranscription as createTranscriptionService,
  getTranscriptions as getTranscriptionsService,
  getTranscriptionById as getTranscriptionByIdService,
  updateTranscription as updateTranscriptionService,
  deleteTranscription as deleteTranscriptionService,
} from '../services/transcriptionService.js';

export const createTranscription = async (req, res, next) => {
  try {
    const { title, audioData, duration } = req.body;
    const userId = req.user.id;

    if (!audioData) {
      return res.status(400).json({ success: false, message: 'No audio data provided' });
    }

    // Convert Base64 audio data to a buffer
    const audioBuffer = Buffer.from(audioData, 'base64');

    // Call the transcription service
    const transcription = await createTranscriptionService(userId, title, audioBuffer, duration);

    res.status(201).json({ success: true, transcription });
  } catch (error) {
    console.error('Error in createTranscription:', error);
    res.status(500).json({ success: false, message: 'Failed to create transcription', error: error.message });
  }
};

export const getTranscriptions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transcriptions = await getTranscriptionsService(userId);
    res.status(200).json({ success: true, transcriptions });
  } catch (error) {
    next(error);
  }
};

export const getTranscriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const transcription = await getTranscriptionByIdService(id, userId);
    res.status(200).json({ success: true, transcription });
  } catch (error) {
    next(error);
  }
};

export const updateTranscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    const transcription = await updateTranscriptionService(id, userId, { title, content });
    res.status(200).json({ success: true, transcription });
  } catch (error) {
    next(error);
  }
};

export const deleteTranscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    await deleteTranscriptionService(id, userId);
    res.status(200).json({ success: true, message: 'Transcription deleted' });
  } catch (error) {
    next(error);
  }
};

