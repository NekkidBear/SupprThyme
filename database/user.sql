-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "email" VARCHAR,
    "home_metro" VARCHAR
);

INSERT INTO "user" (username, password, email, home_metro)
VALUES 
('Kermit',	
        '$2a$10$Xxxac/whdxsEk3u9RcAfT.MCAqff6lwrbCbv.8sSE7hoQEl3r7Lzy',
        'kermit@fakedomain.com',
        'Minneapolis, MN'),
('MissPiggy',
    '$2a$10$11RbL2CMEabZPrIgtC.ZlO0lVgL93JmVtvWfytbYWWrRrjoT7snZi',	
    'piggy@fakedomain.com',
    'St. Paul, MN'),
('Fozzie',
	'$2a$10$ufJeQj.QPYjPYegZLq3ie.mmc4FI8jPk4gmhNxFMusjImdYPD5m8y',
    'fozzie@fakedomain.com',
    'Minneapolis, MN'),
('Gonzo',
    '$2a$10$TphYN4//Rym5P1N76NCv/eNrkZGvBXCb8q61qlb16W.Bf2jxUE1Pa',
   'gonzo@fakedomain.com', 'St. Paul, MN');