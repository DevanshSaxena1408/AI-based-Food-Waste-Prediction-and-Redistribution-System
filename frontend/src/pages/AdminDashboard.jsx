import React, { useState, useEffect } from 'react';
import { adminAPI, donationAPI } from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, donationsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        donationAPI.getAll(),
      ]);

      setUsers(usersRes.data);
      setDonations(donationsRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminAPI.deleteUser(userId);
      setSuccess('User deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;

    try {
      await adminAPI.deleteDonation(donationId);
      setSuccess('Donation deleted successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete donation');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const restaurantCount = users.filter(u => u.role === 'restaurant').length;
  const ngoCount = users.filter(u => u.role === 'ngo').length;
  const totalDonations = donations.length;
  const pendingDonations = donations.filter(d => d.status === 'Pending').length;

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all users, donations, and system data</p>

        <div className="dashboard-stats">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <h3>{restaurantCount}</h3>
            <p>Restaurants</p>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <h3>{ngoCount}</h3>
            <p>NGOs</p>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <h3>{totalDonations}</h3>
            <p>Total Donations</p>
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', borderBottom: '2px solid #eee' }}>
          <button
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`btn ${activeTab === 'donations' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('donations')}
          >
            Donations
          </button>
          <button
            className={`btn ${activeTab === 'restaurants' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('restaurants')}
          >
            Restaurants
          </button>
          <button
            className={`btn ${activeTab === 'ngos' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('ngos')}
          >
            NGOs
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="table-container">
            <h2>All Users</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.contact}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.5rem 1rem' }}
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="table-container">
            <h2>All Donations</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Meal Name</th>
                  <th>Quantity</th>
                  <th>Donor</th>
                  <th>Status</th>
                  <th>Claimed By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{donation.id}</td>
                    <td>{donation.meal_name}</td>
                    <td>{donation.quantity}</td>
                    <td>{donation.donor_name}</td>
                    <td>
                      <span className={`donation-status status-${donation.status.toLowerCase()}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td>{donation.claimed_by_name || '-'}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.5rem 1rem' }}
                        onClick={() => handleDeleteDonation(donation.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div className="table-container">
            <h2>All Restaurants</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Restaurant Name</th>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>License</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => u.role === 'restaurant')
                  .map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.restaurant_name || '-'}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.contact}</td>
                      <td>{user.license_number || '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ngos' && (
          <div className="table-container">
            <h2>All NGOs</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Organization</th>
                  <th>Contact Person</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>People Served</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => u.role === 'ngo')
                  .map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.organization_name || '-'}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.contact}</td>
                      <td>{user.people_served || '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
