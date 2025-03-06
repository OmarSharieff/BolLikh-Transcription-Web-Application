import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { AudioRecorder } from './AudioRecorder';
import { useTranscriptionStore } from '../store/useTranscriptionStore';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const TranscriptionForm = () => {
  const [title, setTitle] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioDuration, setAudioDuration] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTranscription } = useTranscriptionStore();
  const navigate = useNavigate();

  const handleAudioReady = (blob, duration) => {
    setAudioBlob(blob);
    setAudioDuration(duration);

    if (!title) {
      const now = new Date();
      setTitle(`Transcription ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!audioBlob) {
      toast.error('Please record or upload audio first');
      return;
    }
  
    if (!title) {
      toast.error('Please enter a title');
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
  
      if (!token) {
        throw new Error('User not authenticated');
      }
  
      // Convert the audio Blob to a Base64 string
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1]; // Remove the data URL prefix
  
        // Send the audio data to the backend
        const response = await fetch(`${API_URL}/api/transcriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            audioData: base64Audio,
            duration: audioDuration,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to transcribe audio');
        }
  
        const data = await response.json();
  
        // Save the transcription to the database
        const transcription = await createTranscription(
          title,
          data.transcript,
          'assemblyai',
          audioDuration
        );
  
        if (transcription) {
          toast.success('Transcription created successfully');
          navigate(`/transcription/${transcription.id}`);
        }
      };
    } catch (error) {
      console.error('Error creating transcription:', error);
      toast.error(error.message || 'Failed to create transcription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Enter a title for your transcription"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Audio</label>
        <AudioRecorder onAudioReady={handleAudioReady} />

        {audioBlob && (
          <div className="mt-2 rounded-md bg-secondary/50 p-2 text-sm">
            <p>Audio ready for transcription</p>
            {audioDuration && (
              <p className="text-xs text-muted-foreground">
                Duration: {Math.floor(audioDuration / 60)}:
                {Math.floor(audioDuration % 60)
                  .toString()
                  .padStart(2, '0')}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !audioBlob}
        className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Transcribing...' : 'Transcribe Audio'}
      </button>
    </form>
  );
};