import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // When the user presses the browser back/forward (popstate) while inside a
    // protected area, force re-authentication by logging them out and landing
    // on the login page. This ensures an "undo navigation" won't keep the
    // previous session silently active.
    const onPop = () => {
      if (user) {
        logout();
        // push the login page so they must re-enter credentials
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [user, logout, navigate]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
