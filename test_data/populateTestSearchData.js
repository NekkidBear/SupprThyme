const fs = require("fs");
const path = require("path");
const pool = require("../server/modules/pool");

const minneapolisFilePath = path.join(
  __dirname,
  "cache",
  "minneapolisSearchTestData.json"
);
const stPaulFilePath = path.join(
  __dirname,
  "cache",
  "stpaulSearchTestData.json"
);

const minneapolisRestaurantData = JSON.parse(
  fs.readFileSync(minneapolisFilePath, "utf-8")
);
const stPaulRestaurantData = JSON.parse(
  fs.readFileSync(stPaulFilePath, "utf-8")
);

const insertRestaurantData = async () => {
  const client = await pool.connect();
  try {
    const insertData = async (restaurantData) => {
      for (const restaurant of restaurantData.results) {
        const restaurantValues = [
          restaurant.place_id,
          restaurant.name,
          restaurant.geometry.location.lat,
          restaurant.geometry.location.lng,
          restaurant.user_ratings_total,
          restaurant.vicinity,
          restaurant.icon,
          restaurant.rating,
          restaurant.price_level,
          restaurant.types.join(', '),
          restaurant.business_status,
          restaurant.opening_hours ? restaurant.opening_hours.open_now : null,
          JSON.stringify(restaurant.plus_code),
          JSON.stringify(restaurant.photos),
        ];

        const restaurantQuery = {
          text: `
            INSERT INTO restaurants (
              place_id, name, latitude, longitude, user_ratings_total, vicinity, icon, rating, price_level, types,
              business_status, open_now, plus_code, photos
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
            )
          `,
          values: restaurantValues,
        };

        try {
          await client.query(restaurantQuery);
          console.log(`Data for ${restaurant.name} inserted successfully.`);
        } catch (err) {
          console.error(`Error inserting data for ${restaurant.name}:`, err.stack);
        }
      }
    };

    await insertData(minneapolisRestaurantData);
    await insertData(stPaulRestaurantData);
  } catch (err) {
    console.error("Error inserting data:", err.stack);
  } finally {
    client.release();
  }
};

insertRestaurantData().catch((err) =>
  console.error("Error inserting data:", err.stack)
);