import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!token || !user) {
    return <Navigate to="/admin/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}
