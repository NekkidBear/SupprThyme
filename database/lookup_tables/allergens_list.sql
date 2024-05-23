DROP TABLE IF EXISTS "allergens" Cascade;

CREATE TABLE "allergens"(
    "id" SERIAL PRIMARY KEY,
    "allergen" VARCHAR(200)
);

-- per the USA's FDA, these are the 9 major food allergens:
-- Milk
-- Eggs
-- Fish, like bass, flounder, and cod
-- Crustacean shellfish, like crab, lobster, and shrimp
-- Tree nuts, like almonds, walnuts, and pecans
-- Peanuts
-- Wheat
-- Soybeans
-- Sesame

INSERT INTO "allergens" ("allergen")
VALUES
('Milk'),
('Eggs'),
('Fish, like bass, flounder, and cod'),
('Crustacean shellfish, like crab, lobster, and shrimp'),
('Tree nuts, like almonds, walnuts, and pecans'),
('Peanuts'),
('Wheat'),
('Soybeans'),
('Sesame'),
('None');