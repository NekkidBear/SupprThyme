const fs = require('fs');
const path = require('path');
const pool = require('../server/modules/pool');

const minneapolisFilePath = path.join(__dirname, 'cache', 'minneapolisSearchTestData.json');
const stPaulFilePath = path.join(__dirname, 'cache', 'stPaulSearchTestData.json');

const minneapolisRestaurantData = JSON.parse(fs.readFileSync(minneapolisFilePath, 'utf-8'));
const stPaulRestaurantData = JSON.parse(fs.readFileSync(stPaulFilePath, 'utf-8'));

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
          restaurant.photo,
          restaurant.api_detail_url,
          restaurant.awards,
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
          restaurant.description,
          restaurant.web_url,
          restaurant.write_review,
          restaurant.ancestors,
          restaurant.category,
          restaurant.subcategory,
          restaurant.parent_display_name,
          restaurant.is_jfy_enabled,
          restaurant.nearest_metro_station,
          restaurant.phone,
          restaurant.website,
          restaurant.email,
          restaurant.address_obj,
          restaurant.address,
          restaurant.hours,
          restaurant.is_candidate_for_contact_info_suppression,
          restaurant.cuisine,
          restaurant.dietary_restrictions,
          restaurant.booking,
          restaurant.reserve_info,
          restaurant.establishment_types,
        ];

        const restaurantQuery = {
          text: `
            INSERT INTO restaurants (
              location_id, name, latitude, longitude, num_reviews, timezone, location_string, photo,
              api_detail_url, awards, doubleclick_zone, preferred_map_engine, raw_ranking, ranking_geo,
              ranking_geo_id, ranking_position, ranking_denominator, ranking_category, ranking, distance,
              distance_string, bearing, rating, is_closed, open_now_text, is_long_closed, price_level,
              price, description, web_url, write_review, ancestors, category, subcategory,
              parent_display_name, is_jfy_enabled, nearest_metro_station, phone, website, email, address_obj,
              address, hours, is_candidate_for_contact_info_suppression, cuisine, dietary_restrictions,
              booking, reserve_info, establishment_types
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
              $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39,
              $40, $41, $42, $43, $44, $45, $46, $47, $48
            )
          `,
          values: restaurantValues,
        };

        await client.query(restaurantQuery);
      }
    };

    await insertData(minneapolisRestaurantData);
    await insertData(stPaulRestaurantData);

  } catch (err) {
    console.error('Error inserting data:', err.stack);
  } finally {
    client.release();
  }
};

insertRestaurantData().catch((err) => console.error('Error inserting data:', err.stack));
