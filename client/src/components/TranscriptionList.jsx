import React, { useEffect } from 'react';
import { useTranscriptionStore } from '../store/useTranscriptionStore';
import { TranscriptionItem } from './TranscriptionItem';
import { FileQuestion } from 'lucide-react';

export const TranscriptionList = () => {
  const { transcriptions, fetchTranscriptions, isLoading, error } = useTranscriptionStore();
  
  useEffect(() => {
    fetchTranscriptions();
  }, [fetchTranscriptions]);
  
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading transcriptions...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }
  
  if (transcriptions.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No transcriptions yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Record or upload audio to create your first transcription.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {transcriptions.map((transcription) => (
        <TranscriptionItem key={transcription.id} transcription={transcription} />
      ))}
    </div>
  );
};
