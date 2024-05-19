DROP TABLE IF EXISTS "group_members";

CREATE TABLE "group_members" (
    "group_id" INTEGER REFERENCES "groups"("id"),
    "user_id" INTEGER REFERENCES "users"("id"),
    PRIMARY KEY("group_id", "user_id")
  
);