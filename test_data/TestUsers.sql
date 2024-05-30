
-- Insert user data
INSERT INTO "user" (username, password, email, latitude, longitude)
VALUES
    ('Kermit', '$2a$10$Xxxac/whdxsEk3u9RcAfT.MCAqff6lwrbCbv.8sSE7hoQEl3r7Lzy', 'kermit@fakedomain.com', 44.9778, -93.2650),
    ('MissPiggy', '$2a$10$11RbL2CMEabZPrIgtC.ZlO0lVgL93JmVtvWfytbYWWrRrjoT7snZi', 'piggy@fakedomain.com', 44.9778, -93.2650),
    ('Fozzie', '$2a$10$ufJeQj.QPYjPYegZLq3ie.mmc4FI8jPk4gmhNxFMusjImdYPD5m8y', 'fozzie@fakedomain.com', 44.9778, -93.2650),
    ('Gonzo', '$2a$10$TphYN4//Rym5P1N76NCv/eNrkZGvBXCb8q61qlb16W.Bf2jxUE1Pa', 'gonzo@fakedomain.com', 44.9778, -93.2650);

-- Insert address data
INSERT INTO "user_addresses" ("user_id", "street1", "city", "state", "zip", "country")
VALUES
    (1, '123 Sesame Street', 'Minneapolis', 'MN', '55401', 'USA'),
    (2, '456 Muppet Way', 'St. Paul', 'MN', '55102', 'USA'),
    (3, '789 Frog Avenue', 'Minneapolis', 'MN', '55401', 'USA'),
    (4, '321 Gonzo Lane', 'St. Paul', 'MN', '55102', 'USA');