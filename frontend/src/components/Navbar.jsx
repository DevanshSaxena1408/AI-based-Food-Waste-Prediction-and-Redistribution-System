import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">Food Waste<span className="logo-highlight">Management</span></span>
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
              {user.role === 'restaurant' && (
                <>
                  <Link to="/donations/create" className="nav-link">
                    <span className="nav-icon">➕</span>
                    Create Donation
                  </Link>
                  <Link to="/predict-wastage" className="nav-link">
                    <span className="nav-icon">🤖</span>
                    AI Prediction
                  </Link>
                </>
              )}
              {user.role === 'ngo' && (
                <Link to="/donations" className="nav-link">
                  <span className="nav-icon">🔍</span>
                  Browse Donations
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link">
                  <span className="nav-icon">⚙️</span>
                  Admin Panel
                </Link>
              )}

              <div className="navbar-user">
                <div className="user-info">
                  <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="user-name">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link btn-register">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
