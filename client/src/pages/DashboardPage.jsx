import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TranscriptionList } from '../components/TranscriptionList';
import { useAuthStore } from '../store/useAuthStore';

export const DashboardPage = () => {
  const { user, isLoading, getUser } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    getUser();
  }, [getUser]);
  
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
  
  if (!user) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Transcriptions</h1>
            <p className="mt-1 text-muted-foreground">
              Manage and view all your audio transcriptions
            </p>
          </div>
          
          <button
            onClick={() => navigate('/new-transcription')}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span>New Transcription</span>
          </button>
        </div>
        
        <TranscriptionList />
      </main>
      
      <Footer />
    </div>
  );
};
