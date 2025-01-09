-- //ADD EXPIRY TIME by adding 24 hour to current_timestamp
-- //ADD TRIGGER that delete expired row whenever updating converter click left
-- //TRIGGER current_timestamp > expiry_time then delete from table
-- // expiry_time NUMERIC DEFAULT DATETIME(CURRENT_TIMESTAMP, '+24 hours'),

CREATE TABLE guests(
        ip_address TEXT,
        click_left INTEGER NOT NULL,
        expiry_time NUMERIC,
        PRIMARY KEY (ip_address)
    );

CREATE TRIGGER set_expiry
AFTER INSERT ON guests
FOR EACH ROW
BEGIN
    UPDATE guests
    SET expiry_time = DATETIME(CURRENT_TIMESTAMP, '+2 minutes')
    WHERE ip_address = NEW.ip_address;
END;

CREATE TRIGGER remove_expired
AFTER INSERT ON guests
FOR EACH ROW
BEGIN
	DELETE FROM guests
	WHERE expiry_time < CURRENT_TIMESTAMP;
END;

-- PAID USER TABLE
-- only paid user will be kept, guest will be deleted on payment failure

CREATE TABLE users(
    uid TEXT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    premium INT NOT NULL DEFAULT 0, -- 0 = guest, 1 = paid
    upgrade_time NUMERIC,
    PRIMARY KEY (uid)
);