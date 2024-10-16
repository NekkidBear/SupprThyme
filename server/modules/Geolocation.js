const { Loader } = require('@googlemaps/js-api-loader');
const GeocodingError = require('../constants/GeocodingError.js');

const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"]
});

async function normalizeLocation(city, state) {
  console.log("normalizeLocation input:", { city, state });

  if (!city || !state) {
    throw new GeocodingError('City and state must be provided');
  }

  try {
    await loader.load();
    const { Geocoder } = await google.maps.importLibrary("geocoding");
    const geocoder = new Geocoder();

    const response = await geocoder.geocode({
      address: `${city}, ${state}`
    });

    if (response.results.length > 0) {
      const result = response.results[0];
      const cityComponent = result.address_components.find((component) =>
        component.types.includes("locality")
      );
      const stateComponent = result.address_components.find((component) =>
        component.types.includes("administrative_area_level_1")
      );
      
      console.log("normalizeLocation output:", {
        city: cityComponent ? cityComponent.long_name : city,
        state: stateComponent ? stateComponent.long_name : state,
      });
      
      return {
        city: cityComponent ? cityComponent.long_name : city,
        state: stateComponent ? stateComponent.long_name : state,
      };
    } else {
      throw new GeocodingError('Failed to geocode location');
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new GeocodingError('Failed to geocode location');
  }
}

module.exports = normalizeLocation;
