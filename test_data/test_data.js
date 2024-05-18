const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Ensure the cache directory exists
const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

// Function to fetch and write typeahead data for a specific city
async function fetchAndWriteTypeaheadData(city, outputFile) {
  const typeaheadEncodedParams = new URLSearchParams();
  typeaheadEncodedParams.set('q', city);
  typeaheadEncodedParams.set('language', 'en_US');

  const typeaheadOptions = {
    method: 'POST',
    url: 'https://restaurants222.p.rapidapi.com/typeahead',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'restaurants222.p.rapidapi.com',
    },
    data: typeaheadEncodedParams,
  };

  await delay(1000); // Add delay before making the request
  try {
    const typeaheadResponse = await axios.request(typeaheadOptions);
    const jsonData = JSON.stringify(typeaheadResponse.data, null, 2);
    fs.writeFileSync(path.join(cacheDir, outputFile), jsonData);
    console.log(`Data written to ${outputFile}`);
  } catch (error) {
    console.error(error);
  }
}

// Function to get location ID from a specific file
async function getLocationId(inputFile, cityName) {
  try {
    const data = fs.readFileSync(path.join(cacheDir, inputFile), 'utf8');
    const json = JSON.parse(data);
    const locationId = json.results.data.find(
      (result) => result.result_object.name.includes(cityName)
    ).result_object.location_id;
    return locationId;
  } catch (error) {
    console.error(`Error reading location ID from ${inputFile}:`, error);
  }
}

// Function to fetch and write search data for a specific location ID
async function fetchAndWriteSearchData(locationId, outputFile) {
  const searchEncodedParams = new URLSearchParams();
  searchEncodedParams.set('location_id', locationId);
  searchEncodedParams.set('language', 'en_US');
  searchEncodedParams.set('currency', 'USD');
  searchEncodedParams.set('offset', '0');

  const searchOptions = {
    method: 'POST',
    url: 'https://restaurants222.p.rapidapi.com/search',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'restaurants222.p.rapidapi.com',
    },
    data: searchEncodedParams,
  };

  await delay(1000); // Add delay before making the request
  try {
    const searchResponse = await axios.request(searchOptions);
    const jsonData = JSON.stringify(searchResponse.data, null, 2);
    fs.writeFileSync(path.join(cacheDir, outputFile), jsonData);
    console.log(`Data written to ${outputFile}`);

    // Process search results and fetch details for each restaurant
    await processSearchResults(searchResponse.data.results.data, outputFile.replace('SearchTestData', 'Details'));
  } catch (error) {
    console.error(error);
  }
}

// Function to process search results and fetch details for each restaurant
async function processSearchResults(restaurants, outputFile) {
  let details = [];
  if (Array.isArray(restaurants)) {
    for (const restaurant of restaurants) {
      const locationId = restaurant.location_id;
      const detail = await fetchRestaurantDetails(locationId);
      if (detail) {
        details.push(detail);
        console.log('retrieved details for ', detail.results.name)
      }
      await delay(1000); // Delay of 1 second between requests
    }
  } else {
    console.error('Search results data is not an array');
  }

  // Write the collected details to a JSON file
  fs.writeFileSync(path.join(cacheDir, outputFile), JSON.stringify(details, null, 2));
  console.log(`Restaurant details written to ${outputFile}`);
}

// Function to fetch details for a specific restaurant
async function fetchRestaurantDetails(locationId) {
  const detailEncodedParams = new URLSearchParams();
  detailEncodedParams.set('location_id', locationId);
  detailEncodedParams.set('language', 'en_US');
  detailEncodedParams.set('currency', 'USD');

  const detailOptions = {
    method: 'POST',
    url: 'https://restaurants222.p.rapidapi.com/detail',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'restaurants222.p.rapidapi.com',
    },
    data: detailEncodedParams,
  };

  await delay(1000); // Add delay before making the request
  try {
    const detailResponse = await axios.request(detailOptions);
    return detailResponse.data;
  } catch (error) {
    console.error(`Error fetching details for location ID ${locationId}:`, error);
    return null;
  }
}

// Main function to automate API calls for multiple cities
const main = async () => {
  try {
    // Fetch and write typeahead data for Minneapolis
    await fetchAndWriteTypeaheadData('Minneapolis, Minnesota', 'minneapolisTypeaheadTestData.json');

    // Fetch and write typeahead data for St. Paul
    await fetchAndWriteTypeaheadData('St. Paul, Minnesota', 'stPaulTypeaheadTestData.json');

    // Get location IDs for both cities
    const minneapolisLocationId = await getLocationId('minneapolisTypeaheadTestData.json', 'Minneapolis');
    const stPaulLocationId = await getLocationId('stPaulTypeaheadTestData.json', 'Saint Paul');

    if (minneapolisLocationId) {
      // Fetch and write search data for Minneapolis
      await fetchAndWriteSearchData(minneapolisLocationId, 'minneapolisSearchTestData.json');
    }

    if (stPaulLocationId) {
      // Fetch and write search data for St. Paul
      await fetchAndWriteSearchData(stPaulLocationId, 'stPaulSearchTestData.json');
    }
  } catch (error) {
    console.error('Error in main function:', error);
  }
};

// Run the main function
main();
