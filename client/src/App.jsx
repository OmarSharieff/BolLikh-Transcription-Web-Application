import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewTranscriptionPage } from './pages/NewTranscriptionPage';
import { TranscriptionDetailPage } from './pages/TranscriptionDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { getUser } = useAuthStore();
  const { theme } = useThemeStore();
  
  useEffect(() => {
    getUser();
  }, [getUser]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/new-transcription" 
        element={
          <ProtectedRoute>
            <NewTranscriptionPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/transcription/:id" 
        element={
          <ProtectedRoute>
            <TranscriptionDetailPage />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;