import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Demo user for preview mode
const DEMO_USER = {
  id: 'demo-123',
  email: 'demo@aisdr.com',
  firstName: 'Demo',
  lastName: 'User',
  apiKey: 'demo-api-key',
  subscription: {
    tier: 'growth',
    leadsRemaining: 450,
    totalLeads: 500,
    expiresAt: '2026-03-20'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const demo = localStorage.getItem('demoMode');
    if (demo === 'true') {
      setIsDemoMode(true);
      setUser(DEMO_USER);
      setLoading(false);
    } else if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user/profile');
      setUser(response.data.data.user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    // Demo mode for preview
    if (email === 'demo@aisdr.com' && password === 'demo') {
      setIsDemoMode(true);
      localStorage.setItem('demoMode', 'true');
      setUser(DEMO_USER);
      return { success: true };
    }
    
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    // Demo mode - just log them in as demo
    setIsDemoMode(true);
    localStorage.setItem('demoMode', 'true');
    setUser(DEMO_USER);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demoMode');
    setUser(null);
    setIsDemoMode(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      setUser(response.data.data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed';
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
