import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 hover:bg-secondary transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};
