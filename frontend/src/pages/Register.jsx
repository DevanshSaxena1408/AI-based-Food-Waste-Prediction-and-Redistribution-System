import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LocationPicker from '../components/LocationPicker';
import { getLocationWithAddress } from '../utils/geolocation';
import { reverseGeocode } from '../utils/geolocation';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    contact: '',
    address: '',
    latitude: '',
    longitude: '',
    role: 'restaurant',
    // Restaurant fields
    restaurant_name: '',
    license_number: '',
    // NGO fields
    organization_name: '',
    certification: '',
    people_served: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Don't auto-detect on mount - let user choose method
  const detectLocation = async () => {
    setDetectingLocation(true);
    setError('');
    setSuccess('');

    try {
      const { latitude, longitude, address } = await getLocationWithAddress();

      setFormData(prev => ({
        ...prev,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        address: address,
      }));

      setLocationDetected(true);
      setSuccess('✓ Location detected successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Location detection failed:', err);
      // Don't show error - just inform user about alternatives
      setError('');
      alert('Location detection is not available on your device.\n\nPlease use one of these options:\n• Click on the map below to select your location\n• Enter coordinates manually');
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationChange = async (lat, lng) => {
  // Update coordinates
  setFormData(prev => ({
    ...prev,
    latitude: lat.toString(),
    longitude: lng.toString(),
  }));

  try {
    // Fetch address from coordinates
    const address = await reverseGeocode(lat, lng);

    setFormData(prev => ({
      ...prev,
      address: address,
    }));

    setLocationDetected(true);
  } catch (err) {
    console.error('Reverse geocode failed:', err);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.latitude || !formData.longitude) {
        setError('Please select your location on the map or use GPS detection.');
        setLoading(false);
        return;
      }

      // Convert latitude and longitude to numbers
      const submitData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contact: formData.contact,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        role: formData.role,
      };

      // Add role-specific fields only if they have values
      if (formData.role === 'restaurant') {
        if (formData.restaurant_name) {
          submitData.restaurant_name = formData.restaurant_name;
        }
        if (formData.license_number) {
          submitData.license_number = formData.license_number;
        }
      } else if (formData.role === 'ngo') {
        if (formData.organization_name) {
          submitData.organization_name = formData.organization_name;
        }
        if (formData.certification) {
          submitData.certification = formData.certification;
        }
        if (formData.people_served) {
          submitData.people_served = parseInt(formData.people_served);
        }
        if (formData.description) {
          submitData.description = formData.description;
        }
      }

      await register(submitData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);

      // Handle different error formats
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response?.data) {
        const errorData = err.response.data;

        // Handle Pydantic validation errors (array of objects)
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(e => e.msg).join(', ');
        }
        // Handle string error
        else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
        // Handle object error
        else if (errorData.detail && typeof errorData.detail === 'object') {
          errorMessage = JSON.stringify(errorData.detail);
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="register-container">
        <div className="register-header">
          <h2>Create Your Account</h2>
          <p>Join us in making a difference - fight food waste together</p>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="restaurant">Restaurant Owner / Donor</option>
              <option value="ngo">NGO</option>
            </select>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={72}
              placeholder="Enter your password (6-72 characters)"
            />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="Enter your contact number"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label>Address</label>
              {locationDetected && (
                <span style={{ color: '#28a745', fontSize: '0.875rem' }}>
                  ✓ Auto-detected
                </span>
              )}
            </div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder={detectingLocation ? "Detecting address..." : "Your address will be auto-detected"}
              disabled={detectingLocation}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label>Location</label>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={detectLocation}
                disabled={detectingLocation}
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                {detectingLocation ? 'Detecting...' : '📍 Detect My Location'}
              </button>
            </div>
            {detectingLocation && (
              <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '10px' }}>
                📍 Detecting your location... Please allow location access if prompted.
              </p>
            )}
            {!detectingLocation && !locationDetected && (
              <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '10px' }}>
                💡 <strong>Easiest way:</strong> Click anywhere on the map below to set your location!
              </p>
            )}
            <LocationPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
            />
            {formData.latitude && formData.longitude && (
              <div style={{ marginTop: '10px', padding: '10px', background: '#e8f4f8', borderRadius: '4px', fontSize: '0.875rem' }}>
                <strong>Selected Coordinates:</strong> {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
              </div>
            )}
          </div>

          {formData.role === 'restaurant' && (
            <>
              <div className="form-group">
                <label>Restaurant Name</label>
                <input
                  type="text"
                  name="restaurant_name"
                  value={formData.restaurant_name}
                  onChange={handleChange}
                  placeholder="Enter restaurant name"
                />
              </div>

              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  placeholder="Enter license number"
                />
              </div>
            </>
          )}

          {formData.role === 'ngo' && (
            <>
              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  placeholder="Enter organization name"
                />
              </div>

              <div className="form-group">
                <label>Certification</label>
                <input
                  type="text"
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  placeholder="Enter certification details"
                />
              </div>

              <div className="form-group">
                <label>Number of People Served</label>
                <input
                  type="number"
                  name="people_served"
                  value={formData.people_served}
                  onChange={handleChange}
                  placeholder="Enter number of people served"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter organization description"
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Create Account' : 'Register Now'}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
          <p>
            <Link to="/">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
