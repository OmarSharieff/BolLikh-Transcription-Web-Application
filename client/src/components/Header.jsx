import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Fixed import
import { Headphones, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';

export const Header = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  
  const headerVariants = {
    hidden: { y: -100 },
    visible: { 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        yoyo: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <motion.header 
      className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div whileHover="hover" variants={logoVariants}>
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <motion.div
              animate={{ rotate: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <Headphones className="h-6 w-6 text-primary" />
            </motion.div>
            <span>BolLikh</span>
          </Link>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.full_name || user.email}</span>
                </Link>
              </motion.div>
              
              <motion.button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium hover:bg-secondary/80"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
                >
                  Sign in
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Sign up
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};