const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router'); // import the user router
const testingRouter = require('./routes/testing.router'); // import the testing router
const formRouter = require('./routes/preferences_form.router'); // import the form router
const userPrefsRouter = require('./routes/userPreferences.router'); //import the user preferences router
const restaurantsRouter = require('./routes/restaurants.router'); //import the restaurants router

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);
app.use('/api/test', testingRouter); //add the /test endpoint
app.use('/api/form_data', formRouter);
app.use('/api/user_preferences', userPrefsRouter);
app.use('/api/restaurants', restaurantsRouter)

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
