import React from 'react';
import { Link } from 'react-router';
import { FileQuestion } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16">
        <FileQuestion className="h-24 w-24 text-muted-foreground" />
        
        <h1 className="mt-6 text-4xl font-bold">404 - Page Not Found</h1>
        
        <p className="mt-4 max-w-md text-center text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="mt-8 flex gap-4">
          <Link
            to="/"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Go Home
          </Link>
          
          <Link
            to="/dashboard"
            className="rounded-md border border-input bg-background px-4 py-2 hover:bg-secondary/50"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
