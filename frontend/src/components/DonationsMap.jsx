import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icon for pending donations
const pendingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for accepted donations
const acceptedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DonationsMap = ({ donations, userLocation, onDonationClick }) => {
  // Default center
  const center = userLocation || { lat: 28.6139, lng: 77.2090 };

  // Filter donations with valid coordinates
  const validDonations = donations.filter(
    d => d.latitude && d.longitude && !isNaN(d.latitude) && !isNaN(d.longitude)
  );

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Legend */}
      <div style={{ marginBottom: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
        <p style={{ margin: '5px 0' }}>
          <span style={{ display: 'inline-block', width: '20px', height: '20px', background: '#28a745', borderRadius: '50%', marginRight: '10px' }}></span>
          <strong>Green:</strong> Available Donations
        </p>
        <p style={{ margin: '5px 0' }}>
          <span style={{ display: 'inline-block', width: '20px', height: '20px', background: '#dc3545', borderRadius: '50%', marginRight: '10px' }}></span>
          <strong>Red:</strong> Claimed Donations
        </p>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {/* Donation markers */}
        {validDonations.map((donation) => (
          <Marker
            key={donation.id}
            position={{ lat: donation.latitude, lng: donation.longitude }}
            icon={donation.status === 'Pending' ? pendingIcon : acceptedIcon}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ marginBottom: '10px' }}>{donation.meal_name}</h3>

                <p><strong>Quantity:</strong> {donation.quantity}</p>
                <p><strong>Expiry:</strong> {donation.expiry_date}</p>
                <p><strong>Donor:</strong> {donation.donor_name}</p>

                {donation.distance !== undefined && (
                  <p><strong>Distance:</strong> {donation.distance} km</p>
                )}

                <p>
                  <span className={`donation-status status-${donation.status.toLowerCase()}`}>
                    {donation.status}
                  </span>
                </p>

                {/* ✅ Only this triggers navigation */}
                {donation.status === 'Pending' && (
                  <button
                    className="btn btn-success"
                    style={{ marginTop: '10px', width: '100%', padding: '5px' }}
                    onClick={() => onDonationClick && onDonationClick(donation)}
                  >
                    View Details
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {validDonations.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          No donations to display on map
        </p>
      )}
    </div>
  );
};

export default DonationsMap;