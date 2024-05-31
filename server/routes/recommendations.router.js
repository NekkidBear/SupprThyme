const express = require("express");
const router = express.Router();
const pool = require("../modules/pool.js");

async function filterRestaurants(userId, allRestaurants) {
  // Fetch the user's preferences
  const preferencesRes = await pool.query(
    "SELECT * FROM user_preferences WHERE user_id = $1",
    [userId]
  );
  const userPreferences = preferencesRes.rows[0];

  // Filter the restaurants
  return allRestaurants.filter((restaurant) => {
    const dietaryRestrictions = JSON.parse(restaurant.dietary_restrictions);
    const hours = JSON.parse(restaurant.hours);
    const reserveInfo = JSON.parse(restaurant.reserve_info);

    // Check if the restaurant meets the user's dietary restrictions
    if (
      userPreferences &&
      userPreferences.dietaryRestrictions &&
      !userPreferences.dietaryRestrictions.every((restriction) =>
        restaurant.dietaryRestrictions.includes(restriction)
      )
    ) {
      return false;
    }

    // Check if the restaurant is open now
    const currentTime = new Date();
    const currentDay = currentTime.getDay();
    const currentHour = currentTime.getHours();
    if (
      !hours[currentDay] ||
      currentHour < hours[currentDay].open ||
      currentHour > hours[currentDay].close
    ) {
      return false;
    }

    // Check if the restaurant accepts large parties
    if (userPreferences.acceptsLargeParties && !reserveInfo) {
      return false;
    }

    // If the restaurant passed all checks, include it in the results
    return true;
  });
}

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  // Check if userId is defined and is an integer
  if (!userId || !Number.isInteger(Number(userId))) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  // Fetch the user's preferences
  const preferencesRes = await pool.query(
    "SELECT * FROM user_preferences WHERE user_id = $1",
    [userId]
  );
  const userPreferences = preferencesRes.rows[0];

  // Fetch all restaurants
  const restaurantsRes = await pool.query("SELECT * FROM restaurants");
  const allRestaurants = restaurantsRes.rows;

  // Filter the restaurants based on the user's preferences
  const recommendedRestaurants = await filterRestaurants(
    userPreferences,
    allRestaurants
  );

  res.json(recommendedRestaurants.slice(0, 5)); // Return the top 5 recommended restaurants
});

module.exports = router;
