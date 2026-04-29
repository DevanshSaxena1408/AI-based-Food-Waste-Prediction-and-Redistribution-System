import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donationAPI, uploadImage } from '../services/api';
import LocationPicker from '../components/LocationPicker';
import { getLocationWithAddress } from '../utils/geolocation';
import { reverseGeocode } from '../utils/geolocation';

const CreateDonation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  // Don't auto-detect - let user choose method
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

  const [formData, setFormData] = useState({
    meal_name: '',
    quantity: '',
    image: '',
    packaging_type: 'Container',
    expiry_date: '',
    reason: 'Excess Production',
    description: '',
    address: user.address || '',
    latitude: user.latitude || '',
    longitude: user.longitude || '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLocationChange = async (lat, lng) => {

    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));

    // only fetch address if coordinates actually changed significantly
    if (
      Math.abs(lat - parseFloat(formData.latitude || 0)) < 0.0005 &&
      Math.abs(lng - parseFloat(formData.longitude || 0)) < 0.0005
    ) {
      return;
    }

    try {
      const address = await reverseGeocode(lat, lng);

      setFormData(prev => ({
        ...prev,
        address: address,
      }));

      setLocationDetected(true);
    } catch (err) {
      console.error("Reverse geocode failed", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await uploadImage(file);
      setFormData({
        ...formData,
        image: `http://localhost:8000${result.url}`,
      });
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        donor_id: user.id,
      };

      await donationAPI.create(submitData);
      setSuccess('Donation created successfully! NGOs have been notified.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create Food Donation</h2>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Meal Name *</label>
            <input
              type="text"
              name="meal_name"
              value={formData.meal_name}
              onChange={handleChange}
              required
              placeholder="e.g., Vegetable Biryani"
            />
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              placeholder="e.g., 50 servings"
            />
          </div>

          <div className="form-group">
            <label>Food Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            {uploadingImage && <p>Uploading image...</p>}
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '8px' }}
              />
            )}
          </div>

          <div className="form-group">
            <label>Packaging Type *</label>
            <select
              name="packaging_type"
              value={formData.packaging_type}
              onChange={handleChange}
              required
            >
              <option value="Container">Container</option>
              <option value="Box">Box</option>
              <option value="Bag">Bag</option>
              <option value="Wrapped">Wrapped</option>
            </select>
          </div>

          <div className="form-group">
            <label>Expiry Date & Time *</label>
            <input
              type="datetime-local"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason for Donation *</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            >
              <option value="Excess Production">Excess Production</option>
              <option value="Event Leftover">Event Leftover</option>
              <option value="Near Expiry">Near Expiry</option>
              <option value="Daily Surplus">Daily Surplus</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the food item, ingredients, allergens, etc."
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label>Pickup Address *</label>
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
              placeholder={detectingLocation ? "Detecting address..." : "Pickup address"}
              disabled={detectingLocation}
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label>Pickup Location</label>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={detectLocation}
                disabled={detectingLocation}
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                {detectingLocation ? 'Detecting...' : 'Detect My Location'}
              </button>
            </div>
            {detectingLocation && (
              <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '10px' }}>
                📍 Detecting your location... Please allow location access if prompted.
              </p>
            )}
            <LocationPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
            />
            {formData.latitude && formData.longitude && (
              <div style={{ marginTop: '10px', padding: '10px', background: '#e8f4f8', borderRadius: '4px', fontSize: '0.875rem' }}>
                <strong>Pickup Coordinates:</strong> {parseFloat(formData.latitude).toFixed(6)}, {parseFloat(formData.longitude).toFixed(6)}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Donation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDonation;
