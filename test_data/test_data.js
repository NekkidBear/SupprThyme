const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

async function fetchNearbySearchResults(city, state) {
  const apiKey = process.env.GEOCODING_API_KEY;
  const location = `${city},${state}`;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=1500&type=restaurant&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching nearby search results for ${city}, ${state}:`, error);
    return [];
  }
}

async function fetchPlaceDetails(placeId) {
  const apiKey = process.env.GEOCODING_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching place details for place ID ${placeId}:`, error);
    return null;
  }
}

async function generateAndSaveTestData() {
  const cities = [
    { name: 'Minneapolis', state: 'Minnesota' },
    { name: 'St. Paul', state: 'Minnesota' }
  ];

  for (const city of cities) {
    // Fetch and save nearby search results
    const nearbySearchResults = await fetchNearbySearchResults(city.name, city.state);
    fs.writeFileSync(
      path.join(cacheDir, `${city.name.toLowerCase()}SearchTestData.json`),
      JSON.stringify({ results: nearbySearchResults }, null, 2)
    );
    console.log(`Nearby search data written for ${city.name}`);

    // Fetch and save place details for each result
    const placeDetails = [];
    for (const result of nearbySearchResults) {
      const details = await fetchPlaceDetails(result.place_id);
      if (details) {
        placeDetails.push(details);
      }
    }
    fs.writeFileSync(
      path.join(cacheDir, `${city.name.toLowerCase()}Details.json`),
      JSON.stringify(placeDetails, null, 2)
    );
    console.log(`Place details data written for ${city.name}`);
  }
}

generateAndSaveTestData().catch(console.error);
