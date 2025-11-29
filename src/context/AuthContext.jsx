import { createContext, useContext, useState, useEffect } from 'react';
import { mockDataService } from '../services/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('smartcity_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const result = mockDataService.login(email, password);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('smartcity_user', JSON.stringify(result.user));
    }
    return result;
  };

  const register = (email, password, fullName, role) => {
    const result = mockDataService.register(email, password, fullName, role);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('smartcity_user', JSON.stringify(result.user));
    }
    return result;
  };

  const logout = () => {
    mockDataService.logout();
    setUser(null);
    localStorage.removeItem('smartcity_user');
  };

  // Sign in using a Google credential (JWT) or a small profile object.
  // For a production app you must verify the token on the server side.
  const signInWithGoogle = (credentialOrProfile) => {
    let profile = null;

    // If we receive a string, assume it's a JWT credential returned by GSI
    if (typeof credentialOrProfile === 'string') {
      try {
        const payload = credentialOrProfile.split('.')[1];
        const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        profile = { email: json.email, fullName: json.name };
      } catch (err) {
        return { success: false, error: 'Invalid Google credential' };
      }
    } else if (credentialOrProfile && credentialOrProfile.email) {
      profile = credentialOrProfile;
    } else {
      return { success: false, error: 'Invalid Google profile' };
    }

    const result = mockDataService.signInWithGoogle(profile);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('smartcity_user', JSON.stringify(result.user));
    }
    return result;
  };

  const value = {
    user,
    login,
    register,
    signInWithGoogle,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
