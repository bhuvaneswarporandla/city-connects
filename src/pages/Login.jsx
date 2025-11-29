import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, signInWithGoogle } = useAuth();

  // callback for GSI credential response
  const handleGoogleCredential = async (resp) => {
    if (!resp || !resp.credential) return;
    const result = signInWithGoogle(resp.credential);
    if (result.success) {
      // navigate user to the right dashboard
      if (result.user.role === 'admin') navigate('/admin-dashboard');
      else navigate('/user-dashboard');
    } else {
      setError(result.error || 'Google sign-in failed');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = login(email, password);
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (typeof window !== 'undefined' && window.google && clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential
      });

      // render the Google button into the container below
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large', width: '280' }
      );
    }
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login to City Connects</h2>

        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Admin: admin@smartcity.com / admin123</p>
          <p>User: user@smartcity.com / user123</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Google sign-in container (button gets rendered here by GSI) */}
        <div style={{marginBottom: '12px'}}>
          <div id="google-signin-button"></div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button">Login</button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
