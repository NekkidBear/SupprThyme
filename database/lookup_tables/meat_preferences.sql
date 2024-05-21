DROP TABLE IF EXISTS "meat_preferences" CASCADE;
CREATE TABLE "meat_preferences" (
    "id" SERIAL PRIMARY KEY,
    "preference" VARCHAR(50) NOT NULL
);

INSERT INTO "meat_preferences" ("preference")
VALUES
    ('Vegetarian'),
    ('Vegan'),
    ('Non-vegetarian');