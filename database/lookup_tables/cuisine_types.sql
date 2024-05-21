DROP TABLE IF EXISTS "cuisine_types" CASCADE;

CREATE TABLE "cuisine_types" (
    "id" SERIAL PRIMARY KEY,
    "type" VARCHAR(100) NOT NULL
);

-- Insert some initial cuisine types
INSERT INTO "cuisine_types" ("type")
VALUES
    ('Italian'),
    ('Mexican'),
    ('Indian'),
    ('Chinese'),
    ('American'),
    ('Japanese');d