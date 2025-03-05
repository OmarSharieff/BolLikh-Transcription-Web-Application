import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileAudio, Pencil } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTranscriptionStore } from '../store/useTranscriptionStore';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-toastify';

export const TranscriptionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuthStore();
  const {
    currentTranscription,
    isLoading,
    error,
    getTranscription,
    updateTranscription,
  } = useTranscriptionStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    if (id) {
      getTranscription(id);
    }
  }, [id, getTranscription]);

  useEffect(() => {
    if (currentTranscription) {
      setEditedTitle(currentTranscription.title);
      setEditedContent(currentTranscription.content);
    }
  }, [currentTranscription]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleSave = async () => {
    if (!currentTranscription) return;

    try {
      await updateTranscription(currentTranscription.id, {
        title: editedTitle,
        content: editedContent,
      });

      setIsEditing(false);
      toast.success('Transcription updated successfully');
    } catch (error) {
      toast.error('Failed to update transcription');
    }
  };

  const handleDownload = () => {
    if (!currentTranscription) return;

    const element = document.createElement('a');
    const file = new Blob([currentTranscription.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${currentTranscription.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-8">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p>Error: {error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentTranscription) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p>Transcription not found</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <FileAudio className="h-5 w-5" />
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-1 text-xl font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              ) : (
                <h1 className="text-xl font-medium">{currentTranscription.title}</h1>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-md bg-secondary px-3 py-1 text-sm hover:bg-secondary/80"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 rounded-md bg-secondary px-3 py-1 text-sm hover:bg-secondary/80"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 rounded-md bg-secondary px-3 py-1 text-sm hover:bg-secondary/80"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download</span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div>Created: {formatDate(currentTranscription.created_at)}</div>
            <div>API: {currentTranscription.api_used}</div>
            {currentTranscription.duration && (
              <div>
                Duration:{' '}
                {Math.floor(currentTranscription.duration / 60)}:
                {Math.floor(currentTranscription.duration % 60)
                  .toString()
                  .padStart(2, '0')}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border bg-background p-4">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[300px] w-full rounded-md border-0 bg-transparent p-0 focus:outline-none focus:ring-0"
                placeholder="Transcription content"
              />
            ) : (
              <div className="whitespace-pre-wrap">{currentTranscription.content}</div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
