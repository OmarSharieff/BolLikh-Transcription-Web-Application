import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Headphones } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  
  // Clear any existing errors when component mounts
  useEffect(() => {
    useAuthStore.setState({ error: null });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

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
      <motion.div 
        className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <motion.div 
          className="mb-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                <Headphones className="h-6 w-6 text-primary" />
              </motion.div>
              <span>AudioScribe</span>
            </Link>
          </motion.div>
          <motion.h1 
            className="mt-4 text-2xl font-bold"
            variants={itemVariants}
          >
            Sign In
          </motion.h1>
          <motion.p 
            className="mt-2 text-sm text-muted-foreground"
            variants={itemVariants}
          >
            Enter your credentials to access your account
          </motion.p>
        </motion.div>

        {error && (
          <motion.div 
            className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
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
          </motion.div>

          <motion.div variants={itemVariants}>
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
          </motion.div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </motion.form>

        <motion.div 
          className="mt-6 text-center text-sm"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <motion.p 
            className="text-muted-foreground"
            variants={itemVariants}
          >
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};