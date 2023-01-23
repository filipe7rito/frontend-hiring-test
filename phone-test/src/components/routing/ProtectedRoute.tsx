import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// This component is used to protect routes that require authentication
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
