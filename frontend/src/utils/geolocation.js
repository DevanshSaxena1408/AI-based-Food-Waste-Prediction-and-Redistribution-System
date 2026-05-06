/**
 * Geolocation and Reverse Geocoding Utilities
 * Uses browser's Geolocation API and Nominatim (OpenStreetMap)
 */

/**
 * Get user's current location
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
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000,
      }
    );
  });
};

/**
 * Reverse geocode coordinates → address
 * Uses Nominatim API (no API key needed)
 */

let lastRequestTime = 0;

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const now = Date.now();

    // 🔥 Rate limit (important for Nominatim)
    if (now - lastRequestTime < 2000) {
      return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    }

    lastRequestTime = now;

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Geocode failed: ${response.status}`);
    }

    // 🔥 SAFER parsing (prevents crash)
    const text = await response.text();

    // If API returns HTML or empty → prevent crash
    if (!text || text.trim().startsWith("<")) {
      throw new Error("Invalid response (HTML instead of JSON)");
    }

    const data = JSON.parse(text);

    return data.display_name || "Address not found";

  } catch (error) {
    console.error("Reverse geocoding error:", error);

    // fallback (never crash UI)
    return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
  }
};

/**
 * Get location + address together
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