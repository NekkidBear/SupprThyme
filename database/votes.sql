DROP TABLE IF EXISTS "votes" CASCADE;

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    vote BOOLEAN NOT NULL,
    round INTEGER NOT NULL DEFAULT 1,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id, user_id) REFERENCES group_members(group_id, user_id)
);

CREATE OR REPLACE FUNCTION validate_group_member()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM group_members gm
        WHERE gm.group_id = NEW.group_id AND gm.user_id = NEW.user_id
    ) THEN
        RAISE EXCEPTION 'User is not a member of the specified group';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_group_member_trigger
BEFORE INSERT OR UPDATE ON votes
FOR EACH ROW
EXECUTE FUNCTION validate_group_member();