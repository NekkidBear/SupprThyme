DROP TABLE IF EXISTS "religious_restrictions" CASCADE;

CREATE TABLE "religious_restrictions" (
    "id" SERIAL PRIMARY KEY,
    "restriction" VARCHAR(50) NOT NULL
);

INSERT INTO "religious_restrictions" ("restriction")
VALUES
    ('Kosher'),
    ('Halal'),
    ('None');