import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LeadDetail from './pages/LeadDetail';
import Profile from './pages/Profile';
import Billing from './pages/Billing';
import ApiSettings from './pages/ApiSettings';
import ScraperSettings from './pages/ScraperSettings';
import IntentRadar from './pages/IntentRadar';
import AISalesCloser from './pages/AISalesCloser';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user needs onboarding
  if (user && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" />;
  }
  
  return children;
};

// Onboarding route - only accessible to authenticated users who haven't completed onboarding
const OnboardingRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user && user.onboardingCompleted) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Public route - redirect to dashboard if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppContent() {
  return (
    <div className="app">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        
        {/* Onboarding route */}
        <Route path="/onboarding" element={
          <OnboardingRoute>
            <Onboarding onComplete={() => window.location.href = '/dashboard'} />
          </OnboardingRoute>
        } />
        
        {/* Protected routes with Navbar */}
        <Route path="/*" element={
          <ProtectedRoute>
            <>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/leads/:id" element={<LeadDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/settings/api" element={<ApiSettings />} />
                  <Route path="/settings/scraper" element={<ScraperSettings />} />
                  <Route path="/intent-radar" element={<IntentRadar />} />
                  <Route path="/ai-closer" element={<AISalesCloser />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
