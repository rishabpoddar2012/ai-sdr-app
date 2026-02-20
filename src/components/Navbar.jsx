import React from 'react';
import { Link } from 'react-router-dom';
import { DemoAuthContext } from '../App';
import './Navbar.css';

const Navbar = () => {
  const { user } = React.useContext(DemoAuthContext);

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
          <Link to="/ai-closer" className="nav-link">AI Closer</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/billing" className="nav-link">Billing</Link>
        </div>
      )}
      
      <div className="navbar-actions">
        {user && (
          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">{user.firstName || user.email}</span>
              <span className="plan-badge plan-growth">Demo</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
