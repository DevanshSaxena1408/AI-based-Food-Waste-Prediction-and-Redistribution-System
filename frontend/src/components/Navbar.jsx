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

  // ✅ Dynamic route based on role
  const getDashboardRoute = () => {
    if (user.role === 'ngo') return '/donations'; // main working screen
    if (user.role === 'admin') return '/admin';
    return '/dashboard'; // restaurant
  };

  // ✅ Dynamic label
  const getDashboardLabel = () => {
    if (user.role === 'ngo') return 'Browse Donations';
    if (user.role === 'admin') return 'Admin Panel';
    return 'Dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? getDashboardRoute() : '/'} className="navbar-logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">
            Food Waste<span className="logo-highlight">Management</span>
          </span>
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              {/* ✅ Single smart dashboard button */}
              <Link to={getDashboardRoute()} className="nav-link">
                <span className="nav-icon">📊</span>
                {getDashboardLabel()}
              </Link>

              {/* Restaurant-specific */}
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

              {/* ❌ Removed NGO duplicate */}
              {/* ❌ Removed Admin duplicate */}

              <div className="navbar-user">
                <div className="user-info">
                  <span className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
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
              <Link to="/register" className="nav-link btn-register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;