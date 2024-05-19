DROP TABLE IF EXISTS "user_preferences";

CREATE TABLE "user_preferences"(
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "users"("id").
    "max_price_range" INTEGER,
    "meat_preference" INTEGER,
    "religious_restrictions" INTEGER,
    "allergens" TEXT [],
    "cuisine_types" TEXT [],
    "max_distance" NUMERIC,
    "open_now" BOOLEAN DEFAULT 'true',
    "accepts_large_parties" BOOLEAN DEFAULT 'true'
);