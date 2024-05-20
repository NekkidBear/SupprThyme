const fs = require("fs");
const path = require("path");
const pool = require("../server/modules/pool");
const readline = require("readline");

const minneapolisFilePath = path.join(
  __dirname,
  "cache",
  "minneapolisSearchTestData.json"
);
const stPaulFilePath = path.join(
  __dirname,
  "cache",
  "stPaulSearchTestData.json"
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
      for (const restaurant of restaurantData.results.data) {
        const restaurantValues = [
          restaurant.location_id,
          restaurant.name,
          restaurant.latitude,
          restaurant.longitude,
          restaurant.num_reviews,
          restaurant.timezone,
          restaurant.location_string,
          JSON.stringify(restaurant.photo),
          restaurant.api_detail_url,
          JSON.stringify(restaurant.awards),
          restaurant.doubleclick_zone,
          restaurant.preferred_map_engine,
          restaurant.raw_ranking,
          restaurant.ranking_geo,
          restaurant.ranking_geo_id,
          restaurant.ranking_position,
          restaurant.ranking_denominator,
          restaurant.ranking_category,
          restaurant.ranking,
          restaurant.distance,
          restaurant.distance_string,
          restaurant.bearing,
          restaurant.rating,
          restaurant.is_closed,
          restaurant.open_now_text,
          restaurant.is_long_closed,
          restaurant.price_level,
          restaurant.price,
          JSON.stringify(restaurant.neighborhood_info),
          restaurant.description,
          restaurant.web_url,
          restaurant.write_review,
          JSON.stringify(restaurant.ancestors),
          JSON.stringify(restaurant.category),
          JSON.stringify(restaurant.subcategory),
          restaurant.parent_display_name,
          restaurant.is_jfy_enabled,
          JSON.stringify(restaurant.nearest_metro_station),
          restaurant.phone,
          restaurant.website,
          restaurant.email,
          JSON.stringify(restaurant.address_obj),
          restaurant.address,
          JSON.stringify(restaurant.hours),
          restaurant.is_candidate_for_contact_info_suppression,
          JSON.stringify(restaurant.cuisine),
          JSON.stringify(restaurant.dietary_restrictions),
          JSON.stringify(restaurant.booking),
          JSON.stringify(restaurant.reserve_info),
          JSON.stringify(restaurant.establishment_types),
        ];

        const restaurantQuery = {
          text: `
            INSERT INTO restaurants (
              location_id, name, latitude, longitude, num_reviews, timezone, location_string, photo,
              api_detail_url, awards, doubleclick_zone, preferred_map_engine, raw_ranking, ranking_geo,
              ranking_geo_id, ranking_position, ranking_denominator, ranking_category, ranking, distance,
              distance_string, bearing, rating, is_closed, open_now_text, is_long_closed, price_level,
              price, neighborhood_info, description, web_url, write_review, ancestors, category, subcategory,
              parent_display_name, is_jfy_enabled, nearest_metro_station, phone, website, email, address_obj,
              address, hours, is_candidate_for_contact_info_suppression, cuisine, dietary_restrictions,
              booking, reserve_info, establishment_types
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
              $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39,
              $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50
            )
          `,
          values: restaurantValues,
        };

        console.log("Restaurant record:", restaurant);
        const confirmation = await new Promise((resolve) => {
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          rl.question("Do you want to insert this record? (y/n) ", (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === "y");
          });
        });

        if (confirmation) {
          await client.query(restaurantQuery);
          console.log("Record inserted successfully.");
        } else {
          console.log("Record skipped.");
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

// const insertRestaurantData = async () => {
//   const client = await pool.connect();
//   try {
//     const restaurant = minneapolisRestaurantData.results.data[0]; // Get the first restaurant from the data

//     const insertSingleRestaurant = async (restaurantData) => {
//       const restaurantValues = [
//         restaurantData.location_id,
//         restaurantData.name,
//         restaurantData.latitude,
//         restaurantData.longitude,
//         restaurantData.num_reviews,
//         restaurantData.timezone,
//         restaurantData.location_string,
//         JSON.stringify(restaurantData.photo),
//         restaurantData.api_detail_url,
//         JSON.stringify(restaurantData.awards),
//         restaurantData.doubleclick_zone,
//         restaurantData.preferred_map_engine,
//         restaurantData.raw_ranking,
//         restaurantData.ranking_geo,
//         restaurantData.ranking_geo_id,
//         restaurantData.ranking_position,
//         restaurantData.ranking_denominator,
//         restaurantData.ranking_category,
//         restaurantData.ranking,
//         restaurantData.distance,
//         restaurantData.distance_string,
//         restaurantData.bearing,
//         restaurantData.rating,
//         restaurantData.is_closed,
//         restaurantData.open_now_text,
//         restaurantData.is_long_closed,
//         restaurantData.price_level,
//         restaurantData.price,
//         JSON.stringify(restaurantData.neighborhood_info),
//         restaurantData.description,
//         restaurantData.web_url,
//         restaurantData.write_review,
//         JSON.stringify(restaurantData.ancestors),
//         JSON.stringify(restaurantData.category),
//         JSON.stringify(restaurantData.subcategory),
//         restaurantData.parent_display_name,
//         restaurantData.is_jfy_enabled,
//         JSON.stringify(restaurantData.nearest_metro_station),
//         restaurantData.phone,
//         restaurantData.website,
//         restaurantData.email,
//         JSON.stringify(restaurantData.address_obj),
//         restaurantData.address,
//         JSON.stringify(restaurantData.hours),
//         restaurantData.is_candidate_for_contact_info_suppression,
//         JSON.stringify(restaurantData.cuisine),
//         JSON.stringify(restaurantData.dietary_restrictions),
//         JSON.stringify(restaurantData.booking),
//         JSON.stringify(restaurantData.reserve_info),
//         JSON.stringify(restaurantData.establishment_types),
//       ];

//       console.log("restaurantValues:", restaurantValues);

//       const query = {
//         text: `
//         INSERT INTO restaurants (
//           location_id, name, latitude, longitude, num_reviews, timezone, location_string, photo,
//           api_detail_url, awards, doubleclick_zone, preferred_map_engine, raw_ranking, ranking_geo,
//           ranking_geo_id, ranking_position, ranking_denominator, ranking_category, ranking, distance,
//           distance_string, bearing, rating, is_closed, open_now_text, is_long_closed, price_level,
//           price, neighborhood_info, description, web_url, write_review, ancestors, category, subcategory,
//           parent_display_name, is_jfy_enabled, nearest_metro_station, phone, website, email, address_obj,
//           address, hours, is_candidate_for_contact_info_suppression, cuisine, dietary_restrictions,
//           booking, reserve_info, establishment_types
//         ) VALUES (
//           $1, $2, $3, $4, $5, $6, $7, COALESCE($8, '{}'), $9, COALESCE($10, '{}'), $11, $12, $13, $14, $15, $16, $17, $18, $19, COALESCE($20, 0), 
//           COALESCE($21, ''), COALESCE($22, 0), $23, $24, $25, $26, $27, $28, COALESCE($29, '{}'), $30, $31, $32, COALESCE($33, '{}'), COALESCE($34, '{}'), COALESCE($35, '{}'), $36, $37, COALESCE($38, '{}'), 
//           $39, $40, $41, COALESCE($42, '{}'), $43, COALESCE($44, '{}'), $45, COALESCE($46, '{}'), COALESCE($47, '{}'), COALESCE($48, '{}'), COALESCE($49, '{}'),$50
//         )
//         `,
//         values: restaurantValues,
//       };

//       await client.query(query);
//     };

//     await insertSingleRestaurant(restaurant);
//   } catch (err) {
//     console.error("Error inserting data:", err.stack);
//   } finally {
//     client.release();
//   }
// };

insertRestaurantData().catch((err) =>
  console.error("Error inserting data:", err.stack)
);
