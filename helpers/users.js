import express from 'express';

import { passwordValidation, usernameValidation, loginBypass } from './validation.js';

const usersRouter = express.Router();


usersRouter.get('/login', loginBypass,(req, res) => {
    res.render('login.ejs');
});

usersRouter.post('/login', usernameValidation, passwordValidation, (req, res) => {
    const {username} = req.body;
    req.session.user = username;

    //send user status to ejs
    res.locals.user = req.session.user;

    //had to use HTMX or hx-swaping error-info would not get rendered
    res.set('HX-Redirect', '/');
    res.render('');
});


usersRouter.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('jbz-session');
    res.redirect('/');
})

export default usersRouter;