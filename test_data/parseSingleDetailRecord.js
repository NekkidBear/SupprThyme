const fs = require('fs');
const path = require('path');
const pool = require("../server/modules/pool.js");

async function insertData(restaurant) {
  const client = await pool.connect();
  try {
    const restaurantQuery = {
      text: `
        INSERT INTO restaurant_details (
          place_id, name, address, lat, lng, rating, user_ratings_total, price_level, types, vicinity, opening_hours, reviews
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )
      `,
      values: [
        restaurant.place_id,
        restaurant.name,
        restaurant.formatted_address,
        restaurant.geometry.location.lat,
        restaurant.geometry.location.lng,
        restaurant.rating,
        restaurant.user_ratings_total,
        restaurant.price_level,
        restaurant.types.join(', '),
        restaurant.vicinity,
        JSON.stringify(restaurant.opening_hours),
        JSON.stringify(restaurant.reviews)
      ]
    };

    await client.query(restaurantQuery);
    console.log(`Details for ${restaurant.name} inserted successfully.`);
  } catch (err) {
    console.error(`Error inserting details for ${restaurant.name}:`, err.stack);
  } finally {
    client.release();
  }
}

async function parseRestaurantDetails() {
  try {
    const minneapolisDetailsPath = path.join(__dirname, 'cache/minneapolisDetails.json');
    const stPaulDetailsPath = path.join(__dirname, 'cache/stpaulDetails.json');

    const minneapolisDetails = JSON.parse(fs.readFileSync(minneapolisDetailsPath, 'utf8'));
    const stPaulDetails = JSON.parse(fs.readFileSync(stPaulDetailsPath, 'utf8'));

    for (const restaurant of minneapolisDetails) {
      await insertData(restaurant);
    }
    for (const restaurant of stPaulDetails) {
      await insertData(restaurant);
    }
  } catch (err) {
    console.error("Error parsing restaurant details:", err.stack);
  }
}

parseRestaurantDetails().catch((err) =>
  console.error("Error parsing restaurant details:", err.stack)
);

