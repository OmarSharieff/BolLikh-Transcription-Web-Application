import React from 'react';
import { Link } from 'react-router-dom';
import { FileAudio, Trash2 } from 'lucide-react';
import { useTranscriptionStore } from '../store/useTranscriptionStore';

export const TranscriptionItem = ({ transcription }) => {
  const { deleteTranscription } = useTranscriptionStore();
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this transcription?')) {
      await deleteTranscription(transcription.id);
    }
  };
  
  return (
    <Link
      to={`/transcription/${transcription.id}`}
      className="block rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <FileAudio className="h-5 w-5" />
          </div>
          
          <div>
            <h3 className="font-medium text-card-foreground">{transcription.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {transcription.content.substring(0, 100)}
              {transcription.content.length > 100 ? '...' : ''}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete transcription"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span>Created: {formatDate(transcription.created_at)}</span>
        <span>API: {transcription.api_used}</span>
        {transcription.duration && (
          <span>Duration: {formatDuration(transcription.duration)}</span>
        )}
      </div>
    </Link>
  );
};
