DROP TABLE IF EXISTS "groups";

CREATE TABLE "groups" (
    "id" SERIAL PRIMARY KEY,
    "owner_id" INTEGER REFERENCES "users"("id"),
    "group_name" VARCHAR(100)
);