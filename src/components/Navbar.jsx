import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="logo">AI SDR</span>
        </Link>
      </div>
      
      {user && (
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/intent-radar" className="nav-link">Intent Radar</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/billing" className="nav-link">Billing</Link>
        </div>
      )}
      
      <div className="navbar-actions">
        {user ? (
          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">{user.firstName || user.email}</span>
              <span className={`plan-badge plan-${user.plan}`}>{user.plan}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
