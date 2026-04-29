import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { donationAPI } from '../services/api';
import DonationsMap from '../components/DonationsMap';

// ✅ Haversine Distance Function
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const NGODashboard = () => {
  const { user } = useAuth();

  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [filters, setFilters] = useState({
    status: 'Pending',
    maxDistance: '',
  });

  const [viewMode, setViewMode] = useState('list');

  // ✅ Selected donation from map
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    loadDonations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [donations, filters]);

  // ✅ Auto-scroll to selected donation
  useEffect(() => {
    if (selectedDonation) {
      const el = document.getElementById(`donation-${selectedDonation.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedDonation]);

  const loadDonations = async () => {
    try {
      const response = await donationAPI.getAll();
      setDonations(response.data);
    } catch (error) {
      console.error('Failed to load donations:', error);
      setError('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED FILTER LOGIC
  const applyFilters = () => {
    let filtered = [...donations];

    // ✅ Step 1: Calculate distance for each donation
    if (user.latitude && user.longitude) {
      filtered = filtered.map((d) => {
        if (d.latitude && d.longitude) {
          const distance = calculateDistance(
            parseFloat(user.latitude),
            parseFloat(user.longitude),
            parseFloat(d.latitude),
            parseFloat(d.longitude)
          );

          return {
            ...d,
            distance: Number(distance.toFixed(2)),
          };
        }
        return d;
      });
    }

    // ✅ Step 2: Filter by status
    if (filters.status) {
      filtered = filtered.filter((d) => d.status === filters.status);
    }

    // ✅ Step 3: Filter by max distance
    if (filters.maxDistance) {
      filtered = filtered.filter((d) => {
        if (d.distance !== undefined) {
          return d.distance <= parseFloat(filters.maxDistance);
        }
        return false;
      });
    }

    // ✅ Step 4: Sort by distance
    filtered.sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return 0;
    });

    setFilteredDonations(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleClaim = async (donationId) => {
    setError('');
    setSuccess('');
    setClaiming(donationId);

    try {
      await donationAPI.claim({
        donation_id: donationId,
        ngo_id: user.id,
      });

      setSuccess('Donation claimed successfully! The donor has been notified.');
      loadDonations();

      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to claim donation');
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const pendingCount = donations.filter(d => d.status === 'Pending').length;
  const claimedCount = donations.filter(
    d => d.status === 'Accepted' && d.claimed_by === user.id
  ).length;

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h1>NGO Dashboard</h1>
        <p>Welcome, {user.organization_name || user.name}</p>

        <div className="dashboard-stats">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <h3>{pendingCount}</h3>
            <p>Available Donations</p>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <h3>{claimedCount}</h3>
            <p>Claimed by You</p>
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="filter-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Filter Donations</h3>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>

            <button
              className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('map')}
            >
              Map View
            </button>
          </div>
        </div>

        <div className="filter-controls">
          <div>
            <label>Status: </label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
            </select>
          </div>

          <div>
            <label>Max Distance (km): </label>
            <input
              type="number"
              name="maxDistance"
              value={filters.maxDistance}
              onChange={handleFilterChange}
              placeholder="e.g., 10"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Available Food Donations</h2>

        {filteredDonations.length === 0 ? (
          <p>No donations available matching your filters.</p>
        ) : viewMode === 'map' ? (
          <DonationsMap
            donations={filteredDonations}
            userLocation={
              user.latitude && user.longitude
                ? { lat: user.latitude, lng: user.longitude }
                : null
            }
            onDonationClick={(donation) => {
              setSelectedDonation(donation);
              setViewMode('list');
            }}
          />
        ) : (
          <div className="card-grid">
            {filteredDonations.map((donation) => (
              <div
                key={donation.id}
                id={`donation-${donation.id}`}
                className="card donation-card"
                style={{
                  border:
                    selectedDonation?.id === donation.id
                      ? '2px solid #007bff'
                      : '1px solid #ddd',
                  boxShadow:
                    selectedDonation?.id === donation.id
                      ? '0 0 10px rgba(0,123,255,0.5)'
                      : 'none',
                }}
              >
                {donation.image && (
                  <img src={donation.image} alt={donation.meal_name} />
                )}

                <div className="donation-info">
                  <h3>{donation.meal_name}</h3>

                  <p><strong>Quantity:</strong> {donation.quantity}</p>
                  <p><strong>Packaging:</strong> {donation.packaging_type}</p>
                  <p><strong>Expiry Date:</strong> {donation.expiry_date}</p>
                  <p><strong>Description:</strong> {donation.description}</p>
                  <p><strong>Location:</strong> {donation.address}</p>

                  {donation.distance !== undefined && (
                    <p><strong>Distance:</strong> {donation.distance} km</p>
                  )}

                  <p><strong>Donor:</strong> {donation.donor_name}</p>

                  {donation.donor_contact && (
                    <p><strong>Contact:</strong> {donation.donor_contact}</p>
                  )}

                  <span className={`donation-status status-${donation.status.toLowerCase()}`}>
                    {donation.status}
                  </span>

                  {donation.status === 'Pending' && (
                    <button
                      className="btn btn-success"
                      style={{ marginTop: '10px', width: '100%' }}
                      onClick={() => handleClaim(donation.id)}
                      disabled={claiming === donation.id}
                    >
                      {claiming === donation.id ? 'Claiming...' : 'Claim Donation'}
                    </button>
                  )}

                  {donation.status === 'Accepted' && donation.claimed_by === user.id && (
                    <p style={{ marginTop: '10px', color: 'green', fontWeight: 'bold' }}>
                      You have claimed this donation
                    </p>
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

export default NGODashboard;