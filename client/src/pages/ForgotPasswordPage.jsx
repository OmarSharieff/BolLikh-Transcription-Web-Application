import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Headphones, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
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
          <h1 className="mt-4 text-2xl font-bold">Reset Your Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-primary/10 p-4 text-sm">
              <p>
                Password reset link has been sent to <strong>{email}</strong>. Please check
                your email inbox and follow the instructions to reset your password.
              </p>
              <p className="mt-2">
                If you don't see the email, please check your spam folder.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full rounded-md border border-border bg-card px-4 py-2 hover:bg-secondary/50"
            >
              Try with a different email
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};