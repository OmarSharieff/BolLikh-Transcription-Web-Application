import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TranscriptionForm } from '../components/TranscriptionForm';
import { useAuthStore } from '../store/useAuthStore';

export const NewTranscriptionPage = () => {
  const { user, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return null; // Prevent rendering if redirecting

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
        
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">New Transcription</h1>
          <p className="mt-2 text-muted-foreground">
            Record or upload audio to create a new transcription
          </p>
          
          <div className="mt-8">
            <TranscriptionForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
