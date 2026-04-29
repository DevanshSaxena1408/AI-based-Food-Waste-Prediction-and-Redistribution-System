import React, { useState } from 'react';
import { predictionAPI } from '../services/api';

const WastagePrediction = () => {
  const [formData, setFormData] = useState({
    type_of_food: 'Vegetables',
    number_of_guests: '',
    event_type: 'Wedding',
    quantity: '',
    storage_conditions: 'Refrigerated',
    purchase_history: 'Regular',
    seasonality: 'In Season',
    preparation_method: 'Cooked',
    geographical_location: 'Urban',
    pricing: '',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const submitData = {
        ...formData,
        number_of_guests: parseInt(formData.number_of_guests),
        quantity: parseFloat(formData.quantity),
        pricing: parseFloat(formData.pricing),
      };

      const response = await predictionAPI.predictWastage(submitData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '700px' }}>
        <h2>Food Wastage Prediction</h2>
        <p>Predict potential food wastage for your event or restaurant operations</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type of Food *</label>
            <select
              name="type_of_food"
              value={formData.type_of_food}
              onChange={handleChange}
              required
            >
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat">Meat</option>
              <option value="Seafood">Seafood</option>
              <option value="Bakery">Bakery</option>
              <option value="Prepared Meals">Prepared Meals</option>
            </select>
          </div>

          <div className="form-group">
            <label>Number of Guests *</label>
            <input
              type="number"
              name="number_of_guests"
              value={formData.number_of_guests}
              onChange={handleChange}
              required
              placeholder="e.g., 100"
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Event Type *</label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              required
            >
              <option value="Wedding">Wedding</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Conference">Conference</option>
              <option value="Festival">Festival</option>
              <option value="Daily Service">Daily Service</option>
              <option value="Buffet">Buffet</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity (kg) *</label>
            <input
              type="number"
              step="0.01"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              placeholder="e.g., 50.5"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Storage Conditions *</label>
            <select
              name="storage_conditions"
              value={formData.storage_conditions}
              onChange={handleChange}
              required
            >
              <option value="Refrigerated">Refrigerated</option>
              <option value="Frozen">Frozen</option>
              <option value="Room Temperature">Room Temperature</option>
              <option value="Controlled Atmosphere">Controlled Atmosphere</option>
            </select>
          </div>

          <div className="form-group">
            <label>Purchase History *</label>
            <select
              name="purchase_history"
              value={formData.purchase_history}
              onChange={handleChange}
              required
            >
              <option value="Regular">Regular</option>
              <option value="Occasional">Occasional</option>
              <option value="First Time">First Time</option>
              <option value="Bulk Purchase">Bulk Purchase</option>
            </select>
          </div>

          <div className="form-group">
            <label>Seasonality *</label>
            <select
              name="seasonality"
              value={formData.seasonality}
              onChange={handleChange}
              required
            >
              <option value="In Season">In Season</option>
              <option value="Off Season">Off Season</option>
              <option value="All Year">All Year</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preparation Method *</label>
            <select
              name="preparation_method"
              value={formData.preparation_method}
              onChange={handleChange}
              required
            >
              <option value="Cooked">Cooked</option>
              <option value="Raw">Raw</option>
              <option value="Semi-Cooked">Semi-Cooked</option>
              <option value="Processed">Processed</option>
              <option value="Fresh">Fresh</option>
            </select>
          </div>

          <div className="form-group">
            <label>Geographical Location *</label>
            <select
              name="geographical_location"
              value={formData.geographical_location}
              onChange={handleChange}
              required
            >
              <option value="Urban">Urban</option>
              <option value="Suburban">Suburban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>

          <div className="form-group">
            <label>Pricing (per kg) *</label>
            <input
              type="number"
              step="0.01"
              name="pricing"
              value={formData.pricing}
              onChange={handleChange}
              required
              placeholder="e.g., 150.00"
              min="0"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict Wastage'}
          </button>
        </form>

        {result && (
          <div className="card" style={{ marginTop: '2rem', background: '#f0f8ff' }}>
            <h3>Prediction Results</h3>
            <div style={{ fontSize: '1.1rem', lineHeight: '2' }}>
              <p>
                <strong>Input Quantity:</strong> {result.input_data.quantity} kg
              </p>
              
              {/*
              <p>
                <strong>Predicted Wastage Amount:</strong>{' '}
                <span style={{ color: '#e74c3c', fontSize: '1.3rem', fontWeight: 'bold' }}>
                  {result.wastage_amount.toFixed(2)} kg
                </span>
              </p>
              */}
              <p>
                <strong>Wastage Percentage:</strong>{' '}
                <span style={{ color: '#e74c3c', fontSize: '1.3rem', fontWeight: 'bold' }}>
                  {result.wastage_percentage.toFixed(2)}%
                </span>
              </p>
              <hr />
              <p style={{ marginTop: '1rem' }}>
                <strong>Recommendation:</strong> Based on the prediction, you should plan to
                reduce your food quantity or consider donating the excess food to NGOs to
                minimize wastage.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WastagePrediction;
