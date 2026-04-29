import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component that listens for map clicks
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

const LocationPicker = ({ latitude, longitude, onLocationChange }) => {
  const [position, setPosition] = useState(null);

  // Sync map with parent coordinates ONLY if different
  useEffect(() => {
    if (!latitude || !longitude) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    setPosition(prev => {
      if (prev && prev.lat === lat && prev.lng === lng) {
        return prev;
      }
      return { lat, lng };
    });
  }, [latitude, longitude]);

  // Notify parent when marker changes
  useEffect(() => {
    if (!position) return;
    onLocationChange(position.lat, position.lng);
  }, [position]); // removed onLocationChange dependency to avoid loop

  const center = position || { lat: 12.9716, lng: 77.5946 };

  return (
    <div style={{ marginTop: '10px' }}>
      <p
        style={{
          marginBottom: '10px',
          color: '#666',
          fontSize: '0.9rem',
        }}
      >
        Click on the map to select your location
      </p>

      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>

      {position && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            background: '#e8f4f8',
            borderRadius: '4px',
          }}
        >
          <p>
            <strong>Selected Location:</strong>
          </p>
          <p>Latitude: {position.lat.toFixed(6)}</p>
          <p>Longitude: {position.lng.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;