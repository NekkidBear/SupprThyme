// utils.js
import { createClient } from '@google/maps';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const googleMapsClient = createClient({
  key: googleMapsApiKey,
  Promise: Promise,
});

export const geocodeLocation = async (locationString) => {
  try {
    const response = await googleMapsClient.geocode({
      address: locationString,
    }).asPromise();

    if (response.status === 200 && response.json.results.length > 0) {
      const result = response.json.results[0];
      const { lat, lng } = result.geometry.location;
      return { lat, lng };
    } else {
      throw new Error('Geocoding failed');
    }
  } catch (error) {
    console.error('Error geocoding location:', error);
    return null;
  }
};