const googleMapsClient = require("@google/maps").createClient({
    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    Promise: Promise,
  });
  const GeocodingError = require('../constants/GeocodingError.js')

async function normalizeLocation(city, state) {
    console.log("normalizeLocation input:", { city, state });
  
    if (!city || !state) {
      throw new GeocodingError('City and state must be provided');
    }
  
    const response = await googleMapsClient
      .geocode({
        address: `${city}, ${state}`,
      })
      .asPromise();
  
    if (response.json.results.length > 0) {
      const result = response.json.results[0];
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
  }

  module.exports = normalizeLocation;