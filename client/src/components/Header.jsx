import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Headphones, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '../store/useAuthStore';

export const Header = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Headphones className="h-6 w-6 text-primary" />
          <span>AudioScribe</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.full_name || user.email}</span>
              </Link>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium hover:bg-secondary/80"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};