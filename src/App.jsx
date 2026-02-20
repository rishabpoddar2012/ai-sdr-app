import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LeadDetail from './pages/LeadDetail';
import Profile from './pages/Profile';
import Billing from './pages/Billing';
import IntentRadar from './pages/IntentRadar';
import AISalesCloser from './pages/AISalesCloser';
import './App.css';

// Demo mode - always authenticated
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

// Provide demo user via context
import { createContext } from 'react';
export const DemoAuthContext = createContext({ user: DEMO_USER, isDemoMode: true });

function App() {
  return (
    <DemoAuthContext.Provider value={{ user: DEMO_USER, isDemoMode: true }}>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/intent-radar" element={<IntentRadar />} />
            <Route path="/ai-closer" element={<AISalesCloser />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </DemoAuthContext.Provider>
  );
}

export default App;
