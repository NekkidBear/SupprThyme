DROP TABLE IF EXISTS "user_cuisine_types" CASCADE;

CREATE TABLE "user_cuisine_types" (
    "user_id" INTEGER REFERENCES "user"("id"),
    "cuisine_type_id" INTEGER REFERENCES "cuisine_types"("id"),
    PRIMARY KEY ("user_id", "cuisine_type_id")
);