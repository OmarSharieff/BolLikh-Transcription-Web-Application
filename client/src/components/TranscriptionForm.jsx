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
  const [processingStep, setProcessingStep] = useState('idle'); // 'idle', 'uploading', 'transcribing', 'complete'
  const [completedTranscriptionId, setCompletedTranscriptionId] = useState(null);
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
      setProcessingStep('uploading');
  
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
        
        setProcessingStep('transcribing');
        // Show a loading toast that we can update later
        const toastId = toast.loading('Transcribing your audio...');
  
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
          toast.update(toastId, { 
            render: errorData.message || 'Failed to transcribe audio', 
            type: 'error',
            isLoading: false,
            autoClose: 5000
          });
          throw new Error(errorData.message || 'Failed to transcribe audio');
        }
  
        const data = await response.json();
        
        // Save the transcription to the local store
        const transcription = data.transcription;
        setCompletedTranscriptionId(transcription.id);
        setProcessingStep('complete');
        
        // Update the toast to show success
        toast.update(toastId, { 
          render: 'Transcription completed successfully!', 
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
      };
    } catch (error) {
      console.error('Error creating transcription:', error);
      toast.error(error.message || 'Failed to create transcription');
      setProcessingStep('idle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewTranscription = () => {
    if (completedTranscriptionId) {
      navigate(`/transcription/${completedTranscriptionId}`);
    }
  };

  return (
    <div className="space-y-6">
      {processingStep === 'complete' ? (
        <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center shadow-md">
          <h3 className="text-lg font-medium text-green-800 mb-2">Transcription Complete!</h3>
          <p className="mb-4 text-green-700">Your audio has been successfully transcribed.</p>
          <button
            onClick={handleViewTranscription}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            View Your Transcription
          </button>
        </div>
      ) : (
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
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Audio</label>
            <AudioRecorder onAudioReady={handleAudioReady} disabled={isSubmitting} />

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

          {processingStep === 'transcribing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-blue-400 h-12 w-12 flex items-center justify-center mb-3">
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-blue-700 font-medium">Transcribing your audio...</p>
                <p className="text-sm text-blue-600">This may take a few moments depending on the audio length.</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !audioBlob}
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processingStep === 'uploading' 
              ? 'Uploading Audio...' 
              : processingStep === 'transcribing' 
                ? 'Transcribing...' 
                : 'Transcribe Audio'}
          </button>
        </form>
      )}
    </div>
  );
};