import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Headphones } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase'; // Add this import

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  
  // Clear any existing errors when component mounts
  useEffect(() => {
    useAuthStore.setState({ error: null });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      useAuthStore.setState({ error: null }); // Reset error state before login attempt
      await signIn(email, password);
      toast.success('Successfully signed in!');
      navigate('/dashboard');
    } catch (err) {
      if (err.message === 'Please confirm your email address before signing in.') {
        toast.error(
          <div>
            Please confirm your email address before signing in.{' '}
            <button
              onClick={async () => {
                try {
                  await supabase.auth.resend({
                    type: 'signup',
                    email: email,
                  });
                  toast.success('Confirmation email resent!');
                } catch (resendError) {
                  toast.error('Failed to resend confirmation email.');
                }
              }}
              className="ml-2 text-primary hover:underline"
            >
              Resend confirmation email
            </button>
          </div>
        );
      } else {
        toast.error(err.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/20 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold">
            <Headphones className="h-6 w-6 text-primary" />
            <span>AudioScribe</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};