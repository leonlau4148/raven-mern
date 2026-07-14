import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Route guard — the GoRouter redirect callback equivalent.
// Wraps any page that requires login; kicks you to /login otherwise.
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
