# SupprThyme - Restaurant Search and Group Dining App

SupprThyme is a web application that allows users to search for restaurants, view them on a map, and organize group dining experiences. This project uses React, Redux, Express, Passport, PostgreSQL, and integrates with the Google Places API for restaurant data.

## Features

- Restaurant search using Google Places API
- Interactive map display of search results
- User authentication and authorization
- Group creation and management for dining experiences
- User preference storage for personalized restaurant recommendations

## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)
- [Nodemon](https://nodemon.io)

## Setup Instructions

1. Clone the repository to your local machine.
2. Run `npm install` to install all dependencies.
3. Create a `.env` file in the root directory and add the following variables:

```plaintext
SERVER_SESSION_SECRET=your_session_secret_here
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

Replace `your_session_secret_here` with a long, random string, and `your_google_maps_api_key_here` with your Google Maps API key.

4. Create a new PostgreSQL database named `supprthyme_db` (or update the database name in `server/modules/pool.js` if you prefer a different name).
5. Run the SQL commands in `database/database.sql` to set up the necessary tables.
6. Start the server with `npm run server`.
7. In a new terminal, start the client with `npm run client`.
8. Navigate to `localhost:5173` in your web browser.

## Development

- Server code is located in the `server/` directory.
- Client code is in the `src/` directory.
- Database queries and models are in the `server/models/` directory.

## Testing

- Run `npm test` to execute the test suite.
- API routes can be tested using Postman. Import the `PostmanPrimeSoloRoutesv2.json` file for a collection of sample requests.

## Deployment

This project is set up for deployment on Heroku:

1. Create a new Heroku project.
2. Link the Heroku project to your GitHub repository.
3. Set up a Heroku Postgres database.
4. Add the necessary environment variables in Heroku's settings.
5. Deploy the application using Heroku's deployment options.

## Contributing

If you'd like to contribute to SupprThyme, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## Licensing

The code in this project is licensed under MIT license.
