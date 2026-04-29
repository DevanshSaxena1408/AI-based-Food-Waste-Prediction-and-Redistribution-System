import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { donationAPI } from '../services/api';

const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const response = await donationAPI.getAll();
      setDonations(response.data);

      // Calculate stats
      const total = response.data.length;
      const pending = response.data.filter(d => d.status === 'Pending').length;
      const accepted = response.data.filter(d => d.status === 'Accepted').length;

      setStats({ total, pending, accepted });
    } catch (error) {
      console.error('Failed to load donations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h1>Restaurant Dashboard</h1>
        <p>Welcome, {user.restaurant_name || user.name}</p>

        <div className="dashboard-stats">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <h3>{stats.total}</h3>
            <p>Total Donations</p>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <h3>{stats.accepted}</h3>
            <p>Accepted</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Your Donations</h2>
        {donations.length === 0 ? (
          <p>No donations yet. Create your first donation!</p>
        ) : (
          <div className="card-grid">
            {donations.map((donation) => (
              <div key={donation.id} className="card donation-card">
                {donation.image && (
                  <img src={donation.image} alt={donation.meal_name} />
                )}
                <div className="donation-info">
                  <h3>{donation.meal_name}</h3>
                  <p><strong>Quantity:</strong> {donation.quantity}</p>
                  <p><strong>Packaging:</strong> {donation.packaging_type}</p>
                  <p><strong>Expiry Date:</strong> {donation.expiry_date}</p>
                  <p><strong>Reason:</strong> {donation.reason}</p>
                  <p><strong>Description:</strong> {donation.description}</p>
                  <span className={`donation-status status-${donation.status.toLowerCase()}`}>
                    {donation.status}
                  </span>
                  {donation.status === 'Accepted' && donation.claimed_by_name && (
                    <p><strong>Claimed by:</strong> {donation.claimed_by_name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDashboard;
