import express from 'express';
import session from 'express-session';

import { convertLength, convertWeight, convertTemperature } from './helpers/converter.js';
import { clickLeftValidation, inputValidation } from './helpers/validation.js';
import { getClickLeft, isGuestExists, addNewGuest, deleteExpiredGuests } from './helpers/db/guestDb.js';

import usersRouter from './helpers/users.js';
import paymentRouter from './helpers/payment.js';

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({
    secret: 'a123dnbn8!340JaSfd',
    resave: true,
    name: 'jbz-session',
    saveUninitialized: false,
    })
);

app.use(usersRouter);
app.use(paymentRouter);

//send user status to ejs
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    } else {
        res.locals.user = null;
    }
    next();
});

app.get('/', (req, res) => {
    deleteExpiredGuests();

    if (!isGuestExists(req.ip)) {
        addNewGuest(req.ip, 10);
    };
    //update click_left from start
    const {click_left} = getClickLeft(req.ip);
    res.render('index.ejs', {click_left});
});

app.get('/update-click', (req, res) => {
    const {click_left} = getClickLeft(req.ip);
    res.render('widgets/clickBanner.ejs', {click_left});
});


app.get('/length', (req, res) => {
    res.render('widgets/length.ejs');
})

app.post('/length', inputValidation, clickLeftValidation, (req, res) => {
    const {firstUnit, secUnit, value} = req.body;

    //HTMX Trigger response header to update click count for guest /update-click
    res.set('HX-Trigger', 'newClick');

    const converted_value = convertLength(firstUnit, secUnit, value);
    const result = `${value} ${firstUnit} = ${converted_value} ${secUnit}`;
    res.render('widgets/result.ejs', {result});
});


app.get('/weight', (req, res) => {
    res.render('widgets/weight.ejs');
});

app.post('/weight', inputValidation, clickLeftValidation, (req, res) => {
    const {firstUnit, secUnit, value} = req.body;

    res.set('HX-Trigger', 'newClick'); 

    const converted_value = convertWeight(firstUnit, secUnit, value);
    const result = `${value}  ${firstUnit} = ${converted_value} ${secUnit}`;
    res.render('widgets/result.ejs', {result});
});


app.get('/temperature', (req, res) => {
    res.render('widgets/temperature.ejs');
})

app.post('/temperature', inputValidation, clickLeftValidation, (req, res) => {
    const {firstUnit, secUnit, value} = req.body;

    res.set('HX-Trigger', 'newClick'); 

    const converted_value = convertTemperature(firstUnit, secUnit, value);
    const result = `${value} ${firstUnit.toUpperCase()} = ${converted_value} ${secUnit.toUpperCase()}`;
    res.render('widgets/result.ejs', {result});
})

app.listen(3000, () => {
    console.log('http://localhost:3000');
});