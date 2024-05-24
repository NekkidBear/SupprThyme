-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
-- Drop the tables if they already exist
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "user_addresses" CASCADE;

-- Create the "user" table
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(80) UNIQUE NOT NULL,
    "password" VARCHAR(1000) NOT NULL,
    "email" VARCHAR
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

-- Insert user data
INSERT INTO "user" (username, password, email)
VALUES
    ('Kermit', '$2a$10$Xxxac/whdxsEk3u9RcAfT.MCAqff6lwrbCbv.8sSE7hoQEl3r7Lzy', 'kermit@fakedomain.com'),
    ('MissPiggy', '$2a$10$11RbL2CMEabZPrIgtC.ZlO0lVgL93JmVtvWfytbYWWrRrjoT7snZi', 'piggy@fakedomain.com'),
    ('Fozzie', '$2a$10$ufJeQj.QPYjPYegZLq3ie.mmc4FI8jPk4gmhNxFMusjImdYPD5m8y', 'fozzie@fakedomain.com'),
    ('Gonzo', '$2a$10$TphYN4//Rym5P1N76NCv/eNrkZGvBXCb8q61qlb16W.Bf2jxUE1Pa', 'gonzo@fakedomain.com');

-- Insert address data
INSERT INTO "user_addresses" ("user_id", "street1", "city", "state", "zip", "country")
VALUES
    (1, '123 Sesame Street', 'Minneapolis', 'MN', '55401', 'USA'),
    (2, '456 Muppet Way', 'St. Paul', 'MN', '55102', 'USA'),
    (3, '789 Frog Avenue', 'Minneapolis', 'MN', '55401', 'USA'),
    (4, '321 Gonzo Lane', 'St. Paul', 'MN', '55102', 'USA');