-- Drop the tables if they already exist
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "user_addresses" CASCADE;

-- Create the "user" table
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(80) UNIQUE NOT NULL,
    "password" VARCHAR(1000) NOT NULL,
    "email" VARCHAR,
    "latitude" DECIMAL(9,6), -- Add latitude column
    "longitude" DECIMAL(9,6) -- Add longitude column
);

-- Create the "user_addresses" table
CREATE TABLE "user_addresses" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "user"("id") ON DELETE CASCADE,
    "street1" VARCHAR(255),
    "street2" VARCHAR(255),
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "zip" VARCHAR(10),
    "country" VARCHAR(255)
);
