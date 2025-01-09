import {DatabaseSync} from 'node:sqlite';
import crypto from 'crypto';
import util from 'util';

const scrypt = util.promisify(crypto.scrypt);

const db = new DatabaseSync('converter.db');

export function upgradeUser(uid) {
    const query = db.prepare(`
        UPDATE users 
        SET premium = 1, upgrade_time = CURRENT_TIMESTAMP
        WHERE uid = ?
        `);
    query.run(uid);
}

export function deleteUser(uid) {
    const query = db.prepare(`
        DELETE FROM users WHERE uid = ?;
        `);
    query.run(uid);
}

export async function addNewUser(user) {
    const user_id = crypto.randomBytes(6).toString('hex');
    const salt = crypto.randomBytes(16).toString('hex');

    const hashedBuf = await scrypt(user.password, salt, 64);
    const hashedPassword = `${hashedBuf.toString('hex')}.${salt}`;

    console.log(user_id);
    const insert = db.prepare(`
        INSERT INTO users(uid, username, password)
        VALUES (?, ?, ?)
        `);
    insert.run(user_id, user.username, hashedPassword);
    return user_id;
}

export function isUserExists(username) {
    const query = db.prepare(`
        SELECT * FROM users WHERE username = ?
        `);
    if(!query.get(username)){
        return false;
    } else {
        return true;
    }
}

export function getUserInfo(username) {
    const query = db.prepare(`
        SELECT * FROM users WHERE username = ?
        `);
    return query.get(username);
}

export async function isPasswordCorrect(username, password) {
    const query = db.prepare(`
        SELECT password FROM users WHERE username = ?
        `);
    const savedPassword = query.get(username).password;
    const [savedHashedPassword, salt] = savedPassword.split('.');

    const inputHashedBuf = await scrypt(password, salt, 64);
    const inputHashedPassword = inputHashedBuf.toString('hex');
    
    return savedHashedPassword === inputHashedPassword;
}