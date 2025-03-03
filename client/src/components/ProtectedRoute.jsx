import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading, getUser } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    getUser();
  }, [getUser]);
  
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};