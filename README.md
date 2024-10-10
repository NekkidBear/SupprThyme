# SupprThyme

SupprThyme is a collaborative dining decision-making app that helps groups of friends or colleagues choose a restaurant that suits everyone's preferences.

## Features

- User registration and authentication
- Create and manage dining groups
- Set individual dining preferences (cuisine types, dietary restrictions, price range)
- Search for restaurants based on group preferences
- Vote on restaurant choices within a group
- View detailed restaurant information

## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)
- [Nodemon](https://nodemon.io)
- [Postman](https://www.postman.com/) (for API testing)

## Database Setup

Create a new database called `supprthyme_db` and run the following SQL commands to set up the necessary tables:

```SQL
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

-- Add other necessary tables (groups, restaurants, votes, etc.)
```

## Development Setup Instructions

1. Clone the repository to your local machine.
2. Run `npm install` to install all dependencies.
3. Create a `.env` file at the root of the project and add the following:

```plaintext
SERVER_SESSION_SECRET=yourSecretHere
```

Replace `yourSecretHere` with a long random string to keep your application secure.

4. Start your PostgreSQL database.
5. Run `npm run server` to start the server.
6. Run `npm run client` to start the client.
7. Navigate to `localhost:5173` in your browser.

## API Testing with Postman

A Postman collection file (`SupprThymePostmanCollection.json`) is included in the project root. To use it:

1. Open Postman and import the `SupprThymePostmanCollection.json` file.
2. The collection includes requests for user authentication, user preferences, groups, restaurants, and voting.
3. Make sure your local server is running before sending requests.
4. You may need to update the `userId`, `groupId`, and `restaurantId` variables in some requests to match your data.

## Running Tests

This project uses Vitest for unit and integration testing. To run the tests:

1. Run `npm test` to execute all tests once.
2. Run `npm run test:watch` to run tests in watch mode (tests re-run on file changes).
3. Run `npm run coverage` to generate a coverage report.

## Production Build

To create a production build:

1. Run `npm run build` in the terminal. This will create a `build` folder with the production-ready code.
2. You can test the production build by running `npm start` and navigating to `localhost:5173`.

## Directory Structure

- `src/` contains the React application
- `public/` contains static assets for the client-side
- `server/` contains the Express App
- `database/` contains database setup and migration files

Key components:

- `src/components/App/App.jsx`: Main application component
- `src/components/Nav/Nav.jsx`: Navigation component
- `src/components/GroupPage/GroupsPage.jsx`: Group management page
- `src/components/VotingInterface/VotingInterface.jsx`: Voting interface for restaurant selection
- `src/components/RestaurantDetail/RestaurantDetail.jsx`: Detailed view of a restaurant

## Deployment

This application can be deployed to various platforms. Follow the deployment instructions for your chosen platform, ensuring you set up the necessary environment variables and database connections.

## Contributing

If you'd like to contribute to SupprThyme, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## Links

- Project homepage: https://github.com/yourusername/supprthyme
- Issue tracker: https://github.com/yourusername/supprthyme/issues

## Licensing

The code in this project is licensed under MIT license.
