/**
 * Geolocation and Reverse Geocoding Utilities
 * Uses browser's Geolocation API and Nominatim (OpenStreetMap) for reverse geocoding
 */

/**
 * Get user's current location using browser Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enter manually or click the map.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable. Please click on the map or enter manually.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location detection timed out. Please use the map or enter manually.';
            break;
          default:
            errorMessage = 'Location detection failed. Please use the map or enter manually.';
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false, // Changed to false for better compatibility
        timeout: 5000, // Reduced timeout
        maximumAge: 60000, // Allow cached position up to 1 minute old
      }
    );
  });
};

/**
 * Reverse geocode coordinates to get address
 * Uses Nominatim API (OpenStreetMap) - FREE, no API key needed
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>} Formatted address
 */
let lastRequestTime = 0;

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const now = Date.now();

    // Prevent requests faster than 2 seconds
    if (now - lastRequestTime < 2000) {
      return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    }

    lastRequestTime = now;

    const url =
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    // TEMPORARY CORS PROXY
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) throw new Error("Geocode failed");

    const data = await response.json();

    return data.display_name || "Address not found";

  } catch (error) {
    console.error("Reverse geocoding error:", error);

    return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
  }
};

/**
 * Get location and address together
 * @returns {Promise<{latitude: number, longitude: number, address: string}>}
 */
export const getLocationWithAddress = async () => {
  try {
    const { latitude, longitude } = await getCurrentLocation();
    const address = await reverseGeocode(latitude, longitude);

    return {
      latitude,
      longitude,
      address,
    };
  } catch (error) {
    throw error;
  }
};
