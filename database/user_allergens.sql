DROP TABLE IF EXISTS "user_allergens" CASCADE;

CREATE TABLE "user_allergens" (
    "user_id" INTEGER REFERENCES "users"("id") ON DELETE CASCADE,
    "allergen_id" INTEGER REFERENCES "allergens"("id") ON DELETE CASCADE,
    PRIMARY KEY ("user_id", "allergen_id")
);
