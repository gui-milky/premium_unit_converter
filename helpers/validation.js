import { getClickLeft, updateClickLeft } from './db/guestDb.js';
import { isPasswordCorrect, isUserExists } from './db/userDb.js';

export function inputValidation(req, res, next) {
    const value = parseInt(req.body.value);
    if (isNaN(value)) {
        const errMsg = "Value must be a number";
        return res.send('<p id="error-info" class="text-sm mb-1 text-red-500" hx-swap-oob="true">' + errMsg + '</p>');
    }
    next();
}

export function checkOutValidation(req, res, next) {
    const value = parseInt(req.body.value);
    if (isNaN(value)) {
        const errMsg = "Value must be a number";
        return res.send('<p id="error-info" class="text-sm mb-1 text-red-500" hx-swap-oob="true">' + errMsg + '</p>');
    }
    next();
}

export function clickLeftValidation(req, res, next) {
    //skip if user is logged in
    //check how many clicks guest left and update it every time user coonvert
    if (req.session.user) {
        return next();
    }

    const {click_left} = getClickLeft(req.ip);
    if (click_left <= 0) {
        return res.send(`
            <p id="error-info" class="text-sm mb-1 text-red-500" hx-swap-oob="true">
            You have used all your clicks</p>`);
    } else {
        const newClickLeft = parseInt(click_left) - 1;
        updateClickLeft(req.ip, newClickLeft);
        next();
    }
}

export function registerValidation(req, res, next) {
    const {username} = req.body;
    if (isUserExists(username)) {
        return res.send(`
            <p id="error-info" class="text-sm mb-1 text-red-500" hx-swap-oob="true">
            Please enter valid username</p>`);
    } else {
        next();
    }
}

export function usernameValidation(req, res, next) {
    const {username} = req.body;
    if (!isUserExists(username)) {
        return res.send(`
            <p id="error-info" class="text-sm mb-1 text-red-500" hx-swap-oob="true">
            Please enter valid username</p>`);
    } else {
        next();
    }
}

export async function passwordValidation(req, res, next) {
    const {username, password} = req.body;
    const isCorrect = await isPasswordCorrect(username, password);
    if (!isCorrect) {
        return res.send(`
            <p id="error-info" class="text-sm mb-1 text-red-500" hx-swap-oob="true">
            Please enter valid password</p>`);
    } else {
        next();
    }
}

export function loginBypass(req, res, next) {
    console.log(req.session.user);
    if (req.session.user) {
        return res.redirect('/');
    } else {
        next();
    }
}

