const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const typeaheadEncodedParams = new URLSearchParams();
typeaheadEncodedParams.set('q', 'Minneapolis, Minnesota');
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

async function fetchAndWriteTypeaheadData() {
  await delay(1000); // Add delay before making the request
  try {
    const typeaheadResponse = await axios.request(typeaheadOptions);
    const jsonData = JSON.stringify(typeaheadResponse.data, null, 2);
    fs.writeFileSync('restaurantsTypeaheadTestData.json', jsonData);
    console.log('Data written to restaurantsTypeaheadTestData.json');
  } catch (error) {
    console.error(error);
  }
}

async function getLocationId() {
  try {
    const data = fs.readFileSync('restaurantsTypeaheadTestData.json', 'utf8');
    const json = JSON.parse(data);
    const locationId = json.results.data.find(
      (result) => result.result_object.name === 'Minneapolis'
    ).result_object.location_id;
    return locationId;
  } catch (error) {
    console.error('Error reading location ID:', error);
  }
}

async function fetchAndWriteSearchData() {
  try {
    const locationId = await getLocationId();
    if (!locationId) throw new Error('Location ID not found');

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
    const searchResponse = await axios.request(searchOptions);
    const jsonData = JSON.stringify(searchResponse.data, null, 2);
    fs.writeFileSync('restaurantsSearchTestData.json', jsonData);
    console.log('Data written to restaurantsSearchTestData.json');

    // Process search results and fetch details for each restaurant
    await processSearchResults(searchResponse.data.results.data);
  } catch (error) {
    console.error(error);
  }
}

// Function to process search results and fetch details for each restaurant
async function processSearchResults(restaurants) {
  if (Array.isArray(restaurants)) {
    for (const restaurant of restaurants) {
      const locationId = restaurant.location_id;
      await fetchRestaurantDetails(locationId);
      await delay(1000); // Delay of 1 second between requests
    }
  } else {
    console.error('Search results data is not an array');
  }
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
    const restaurantDetails = detailResponse.data;

    // Read existing data from the file, or initialize an empty array
    let existingData = [];
    try {
      const fileData = fs.readFileSync('restaurantDetails.json', 'utf8');
      existingData = JSON.parse(fileData);
    } catch (error) {
      // File doesn't exist, start with an empty array
    }

    // Append the new restaurant details to the existing data
    existingData.push(restaurantDetails);

    // Write the updated data back to the file
    fs.writeFileSync(
      'restaurantDetails.json',
      JSON.stringify(existingData, null, 2)
    );
    console.log(
      `Restaurant details for ${restaurantDetails.name || 'undefined'} written to restaurantDetails.json`
    );
  } catch (error) {
    console.error(error);
  }
}

// Delete the existing files (if any) before running the script
try {
  fs.unlinkSync('restaurantDetails.json');
  console.log('Deleted existing restaurantDetails.json file');
} catch (error) {
  // File doesn't exist, no need to delete
}

try {
  fs.unlinkSync('restaurantsSearchTestData.json');
  console.log('Deleted existing restaurantsSearchTestData.json file');
} catch (error) {
  // File doesn't exist, no need to delete
}

fetchAndWriteTypeaheadData().then(fetchAndWriteSearchData);
