import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { AudioRecorder } from './AudioRecorder';
import { useTranscriptionStore } from '../store/useTranscriptionStore';

export const TranscriptionForm = () => {
  const [title, setTitle] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioDuration, setAudioDuration] = useState(null);
  const [apiProvider, setApiProvider] = useState('openai');
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
      
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('title', title);
      formData.append('apiProvider', apiProvider);
      
      const response = await fetch('http://localhost:3000/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to transcribe audio');
      }
      
      const data = await response.json();
      
      const transcription = await createTranscription(
        title,
        data.transcription,
        apiProvider,
        data.audioUrl,
        audioDuration
      );
      
      if (transcription) {
        toast.success('Transcription created successfully');
        navigate(`/transcription/${transcription.id}`);
      }
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
      
      <div>
        <label className="block text-sm font-medium">Transcription API</label>
        <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background p-3 text-sm hover:bg-secondary/50">
            <input
              type="radio"
              name="apiProvider"
              value="openai"
              checked={apiProvider === 'openai'}
              onChange={() => setApiProvider('openai')}
              className="h-4 w-4 text-primary"
            />
            <span>OpenAI Whisper</span>
          </label>
          
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background p-3 text-sm hover:bg-secondary/50">
            <input
              type="radio"
              name="apiProvider"
              value="google"
              checked={apiProvider === 'google'}
              onChange={() => setApiProvider('google')}
              className="h-4 w-4 text-primary"
            />
            <span>Google Speech-to-Text</span>
          </label>
          
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background p-3 text-sm hover:bg-secondary/50">
            <input
              type="radio"
              name="apiProvider"
              value="mozilla"
              checked={apiProvider === 'mozilla'}
              onChange={() => setApiProvider('mozilla')}
              className="h-4 w-4 text-primary"
            />
            <span>Mozilla DeepSpeech</span>
          </label>
        </div>
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
