import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import LoadingScreen from './LoadingScreen';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, initialized } = useAuthStore();

  if (!initialized || loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user hasn't created character yet, redirect to character creation
  if (user.character.name === 'Hunter' && user.character.level === 1 && user.character.totalXP === 0) {
    // Allow access to character creation page
    if (window.location.pathname === '/character') {
      return <>{children}</>;
    }
    return <Navigate to="/character" replace />;
  }

  return <>{children}</>;
}

