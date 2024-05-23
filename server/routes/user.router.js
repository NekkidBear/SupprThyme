const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// GET route to retrieve user information with address details
router.get('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user information with address details using a database query
    const user = await User.findByPk(userId, {
      include: { model: UserAddress, as: 'address' }
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ message: 'Error fetching user information' });
  }
});

// POST route to handle user registration and address storage
router.post("/api/register", async (req, res) => {
  try {
    const { username, password, email, address } = req.body;

    // Insert user details into the 'users' table
    const user = await User.create({ username, password, email });

    // Insert address details into the 'user_addresses' table
    const userAddress = await UserAddress.create({
      user_id: user.id,
      street1: address.street1,
      street2: address.street2,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post("/login", userStrategy.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
});

module.exports = router;
