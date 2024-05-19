DROP TABLE IF EXISTS "price_ranges";

CREATE TABLE "price_ranges" (
    "id" SERIAL PRIMARY KEY,
    "range" VARCHAR(50) NOT NULL
);

INSERT INTO "price_ranges" ("range")
VALUES
    ('$'),
    ('$$'),
    ('$$$'),
    ('$$$$');