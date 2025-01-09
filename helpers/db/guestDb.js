import {DatabaseSync} from 'node:sqlite';

const db = new DatabaseSync('converter.db');

export function getAll() {
    const query = db.prepare(`SELECT * FROM guests`);
    return query.all();
}

export function addNewGuest (ip_address, numOfClicks) {
    const insert = db.prepare(
        `INSERT INTO guests \("ip_address", "click_left"\)
        VALUES \(?, ?\);`);
    insert.run(ip_address, numOfClicks);
}

export function deleteExpiredGuests() {
    const query = db.prepare(`
        DELETE FROM guests
        WHERE expiry_time < CURRENT_TIMESTAMP;`);
    query.run();
}

export function getClickLeft (ip_address) {
    const query = db.prepare(`
        SELECT click_left FROM guests
        WHERE ip_address = ?;
        `);
    return query.get(ip_address);
}

export function updateClickLeft (ip_address, click_left) {
    const query = db.prepare(`
        UPDATE guests
        SET click_left = ?
        WHERE ip_address = ?;
        `);
    query.run(click_left, ip_address);
}

export function isGuestExists (ip_address) {
    const findIp = db.prepare('SELECT * FROM guests WHERE ip_address = ?');
    const existingGuest = findIp.all(ip_address);
    
    if (existingGuest.length === 0) {
        return false;
    }
    return true;
}

//Check for duplicate username
//If payment completed, insert user into users table
//If users exists in table, he is paid user else guest

