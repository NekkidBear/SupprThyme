const fs = require("fs");
const path = require("path");
const pool = require("../server/modules/pool");

const minneapolisDetailsFilePath = path.join(
  __dirname,
  "cache",
  "minneapolisDetails.json"
);
const stPaulDetailsFilePath = path.join(
  __dirname,
  "cache",
  "stPaulDetails.json"
);

// Function to safely parse JSON
const parseJSONFile = (filePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`Parsed data from ${filePath}:`, data.slice(0, 3)); // Log the first 3 entries
    return data.map((item) => item.results);
  } catch (error) {
    console.error(`Error parsing JSON file at ${filePath}:`, error);
    return null;
  }
};

// Parse JSON data
const minneapolisDetailsData = parseJSONFile(minneapolisDetailsFilePath);
const stPaulDetailsData = parseJSONFile(stPaulDetailsFilePath);

const insertDetailsData = async () => {
  const client = await pool.connect();
  try {
    const insertData = async (detailsData, city) => {
      if (!detailsData) {
        console.error(`No data found for ${city}`);
        return;
      }

      for (const [index, restaurant] of detailsData.entries()) {
        if (!restaurant) {
          console.error(
            `Restaurant data is undefined at index ${index} for ${city}`
          );
          continue;
        }

        console.log(
          `Inserting detail info for ${restaurant.name || "undefined"}`
        );
        console.log(`Restaurant data:`, restaurant); // Log the entire restaurant object
        console.log("address_obj type:", typeof restaurant.address_obj);

        const detailsValues = [
          restaurant.location_id || null,
          restaurant.name || null,
          restaurant.latitude || null,
          restaurant.longitude || null,
          restaurant.num_reviews || null,
          restaurant.timezone || null,
          restaurant.location_string || null,
          restaurant.photo || null,
          restaurant.awards || null,
          restaurant.doubleclick_zone || null,
          restaurant.preferred_map_engine || null,
          restaurant.raw_ranking || null,
          restaurant.ranking_geo || null,
          restaurant.ranking_geo_id || null,
          restaurant.ranking_position || null,
          restaurant.ranking_denominator || null,
          restaurant.ranking_category || null,
          restaurant.ranking || null,
          restaurant.distance || null,
          restaurant.distance_string || null,
          restaurant.bearing || null,
          restaurant.rating || null,
          restaurant.is_closed || false,
          restaurant.open_now_text || null,
          restaurant.is_long_closed || false,
          restaurant.price_level || null,
          restaurant.price || null,
          restaurant.description || null,
          restaurant.web_url || null,
          restaurant.write_review || null,
          restaurant.ancestors || null,
          restaurant.category || null,
          restaurant.subcategory || null,
          restaurant.parent_display_name || null,
          restaurant.is_jfy_enabled || null,
          restaurant.nearest_metro_station || null,
          restaurant.reviews || null,
          restaurant.phone || null,
          restaurant.website || null,
          restaurant.email || null,
          restaurant.address_obj || null,
          restaurant.address || null,
          restaurant.hours || null,
          restaurant.local_name || null,
          restaurant.local_address || null,
          restaurant.local_lang_code || null,
          restaurant.is_candidate_for_contact_info_suppression || false,
          restaurant.cuisine || null,
          restaurant.dietary_restrictions || null,
          restaurant.booking || null,
          restaurant.reserve_info || null,
          restaurant.menu_web_url || null,
          restaurant.establishment_category_ranking || null,
          restaurant.meal_types || null,
          restaurant.establishment_types || null,
          restaurant.dishes || null,
          restaurant.sub_cuisine || null,
          restaurant.storyboard || null,
          restaurant.owners_top_reasons || null,
          restaurant.photo_count || null,
          restaurant.has_review_draft || false,
          restaurant.has_panoramic_photos || false,
          restaurant.rating_histogram || null,
        ];

        await client.query(
          `
          INSERT INTO details (
            location_id,
            name,
            latitude,
            longitude,
            num_reviews,
            timezone,
            location_string,
            photo,
            awards,
            doubleclick_zone,
            preferred_map_engine,
            raw_ranking,
            ranking_geo,
            ranking_geo_id,
            ranking_position,
            ranking_denominator,
            ranking_category,
            ranking,
            distance,
            distance_string,
            bearing,
            rating,
            is_closed,
            open_now_text,
            is_long_closed,
            price_level,
            price,
            description,
            web_url,
            write_review,
            ancestors,
            category,
            subcategory,
            parent_display_name,
            is_jfy_enabled,
            nearest_metro_station,
            reviews,
            phone,
            website,
            email,
            address_obj,
            address,
            hours,
            local_name,
            local_address,
            local_lang_code,
            is_candidate_for_contact_info_suppression,
            cuisine,
            dietary_restrictions,
            booking,
            reserve_info,
            menu_web_url,
            establishment_category_ranking,
            meal_types,
            establishment_types,
            dishes,
            sub_cuisine,
            storyboard,
            owners_top_reasons,
            photo_count,
            has_review_draft,
            has_panoramic_photos,
            rating_histogram
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25,
            $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48,
            $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63
          )
        `,
          detailsValues
        );
      }
    };

    await insertData(minneapolisDetailsData, "Minneapolis");
    await insertData(stPaulDetailsData, "St. Paul");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    client.release();
  }
};

insertDetailsData();
