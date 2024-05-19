DROP TABLE IF EXISTS "votes";

CREATE TABLE "votes" (
    "id" SERIAL PRIMARY KEY,
    "group_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "round" INTEGER NOT NULL DEFAULT 1,
    "voted_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id, user_id) REFERENCES group_members(group_id, user_id),
    CONSTRAINT valid_group_member CHECK (EXISTS (
        SELECT 1
        FROM group_members gm
        WHERE gm.group_id = votes.group_id AND gm.user_id = votes.user_id
    ))
);