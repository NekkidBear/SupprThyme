-- Create the database (if needed)
CREATE DATABASE SupprThyme;

-- Connect to the database
\c supperthyme;

-- Create schema
CREATE SCHEMA IF NOT EXISTS supperthyme;

-- Set the search path to the new schema
SET search_path TO supperthyme;

-- Create lookup tables
\ir lookup_tables/price_ranges.sql
\ir lookup_tables/meat_preferences.sql
\ir lookup_tables/religious_restrictions.sql
\ir lookup_tables/cuisine_types.sql

-- Create main tables
\ir users.sql
\ir groups.sql
\ir user_preferences.sql
\ir group_members.sql
\ir votes.sql

-- Insert initial data (if needed)
INSERT INTO users ("username", "email", "password", "home_metro")
VALUES
    ('Kermit', 'Kermit@example.com', 'hashedpassword1', 'Minneapolis, MN'),
    ('Miss Piggy', 'MissPiggy@example.com', 'hashedpassword2', 'Minneapolis, MN'),
    ('Fozzie', 'Fozzie@example.com', 'hashedpassword3', 'St. Paul, MN')
    ('Gonzo', 'Gonzo@example.com', 'hashedpassword4', 'St. Paul, MN');

INSERT INTO groups (group_name, owner_id)
VALUES
    ('Family', 1),
    ('Friends', 2);

INSERT INTO group_members (group_id, user_id)
VALUES
    (1, 1), (1, 2), (1, 3),
    (2, 2), (2, 3);