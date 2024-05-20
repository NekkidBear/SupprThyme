const fs = require('fs');
const path = require('path');
const pool = require('../server/modules/pool');

const minneapolisDetailsFilePath = path.join(__dirname, 'cache', 'minneapolisDetails.json');
const stPaulDetailsFilePath = path.join(__dirname, 'cache', 'stPaulDetails.json');

const minneapolisDetailsData = JSON.parse(fs.readFileSync(minneapolisDetailsFilePath, 'utf-8'));
const stPaulDetailsData = JSON.parse(fs.readFileSync(stPaulDetailsFilePath, 'utf-8'));

const insertDetailsData = async () => {
  const client = await pool.connect();
  try {
    const insertData = async (detailsData) => {
      for (const restaurant of detailsData) {
        const detailsValues = [
          restaurant.location_id,
          restaurant.name,
          restaurant.latitude,
          restaurant.longitude,
          restaurant.num_reviews,
          restaurant.timezone,
          restaurant.location_string,
          JSON.stringify(restaurant.photo),
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
          restaurant.description,
          restaurant.web_url,
          restaurant.write_review,
          JSON.stringify(restaurant.ancestors),
          JSON.stringify(restaurant.category),
          JSON.stringify(restaurant.subcategory),
          restaurant.parent_display_name,
          restaurant.is_jfy_enabled,
          JSON.stringify(restaurant.nearest_metro_station),
          JSON.stringify(restaurant.reviews),
          restaurant.phone,
          restaurant.website,
          restaurant.email,
          JSON.stringify(restaurant.address_obj),
          restaurant.address,
          JSON.stringify(restaurant.hours),
          restaurant.local_name,
          restaurant.local_address,
          restaurant.local_lang_code,
          restaurant.is_candidate_for_contact_info_suppression,
          JSON.stringify(restaurant.cuisine),
          JSON.stringify(restaurant.dietary_restrictions),
          JSON.stringify(restaurant.booking),
          JSON.stringify(restaurant.reserve_info),
          restaurant.menu_web_url,
          restaurant.establishment_category_ranking,
          JSON.stringify(restaurant.meal_types),
          JSON.stringify(restaurant.establishment_types),
          JSON.stringify(restaurant.dishes),
          JSON.stringify(restaurant.sub_cuisine),
          JSON.stringify(restaurant.storyboard),
          JSON.stringify(restaurant.owners_top_reasons),
          restaurant.photo_count,
          restaurant.has_review_draft,
          restaurant.has_panoramic_photos,
          JSON.stringify(restaurant.rating_histogram)
        ];

        const detailsQuery = {
          text: `
            INSERT INTO "details" (
              location_id, "name", latitude, longitude, num_reviews, timezone, location_string, photo,
              awards, doubleclick_zone, preferred_map_engine, raw_ranking, ranking_geo,
              ranking_geo_id, ranking_position, ranking_denominator, ranking_category, ranking, distance,
              distance_string, bearing, rating, is_closed, "open_now_text", is_long_closed, price_level,
              price, "description", web_url, write_review, ancestors, category, subcategory,
              parent_display_name, is_jfy_enabled, nearest_metro_station, reviews, phone, website, email, address_obj,
              "address", "hours", "local_name", "local_address", "local_lang_code", is_candidate_for_contact_info_suppression, cuisine, dietary_restrictions,
              booking, reserve_info, menu_web_url, establishment_category_ranking, meal_types, establishment_types,
              dishes, sub_cuisine, storyboard, owners_top_reasons, photo_count, has_review_draft, has_panoramic_photos, rating_histogram
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
              $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39,
              $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63
            )
          `,
          values: detailsValues,
        };

        await client.query(detailsQuery);
      }
    };

    await insertData(minneapolisDetailsData);
    await insertData(stPaulDetailsData);

  } catch (err) {
    console.error('Error inserting data:', err.stack);
  } finally {
    client.release();
  }
};

insertDetailsData().catch((err) => console.error('Error inserting data:', err.stack));