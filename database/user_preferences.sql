DROP TABLE IF EXISTS "user_preferences" CASCADE;

CREATE TABLE "user_preferences" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "user"("id"),
    "max_price_range" INTEGER REFERENCES "price_ranges"("id") NULL,
    "meat_preference" INTEGER REFERENCES "meat_preferences"("id") NULL,
    "religious_restrictions" INTEGER REFERENCES "religious_restrictions"("id") NULL,
    "cuisine_types" INTEGER[] references "cuisine_types"("id") NULL,
    "max_distance" NUMERIC NULL DEFAULT 5,
    "open_now" BOOLEAN DEFAULT 'true',
    "accepts_large_parties" BOOLEAN DEFAULT 'true'
);
