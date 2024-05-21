DROP TABLE IF EXISTS "groups" CASCADE;

CREATE TABLE "groups" (
    "id" SERIAL PRIMARY KEY,
    "owner_id" INTEGER REFERENCES "user"("id"),
    "group_name" VARCHAR(100)
);