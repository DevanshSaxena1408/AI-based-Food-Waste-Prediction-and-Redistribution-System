import React from 'react';
import { useAuth } from '../context/AuthContext';
import RestaurantDashboard from './RestaurantDashboard';
import NGODashboard from './NGODashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  switch (user.role) {
    case 'restaurant':
      return <RestaurantDashboard />;
    case 'ngo':
      return <NGODashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div className="container">Invalid user role</div>;
  }
};

export default Dashboard;
