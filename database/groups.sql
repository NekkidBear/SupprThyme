DROP TABLE IF EXISTS "groups" CASCADE;

CREATE TABLE "groups" (
    "id" SERIAL PRIMARY KEY,
    "owner_id" INTEGER REFERENCES "users"("id"),
    "group_name" VARCHAR(100)
);