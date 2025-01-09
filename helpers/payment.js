import express from "express";
import Stripe from "stripe";

import { addNewUser, upgradeUser, deleteUser } from './db/userDb.js';
import { registerValidation } from './validation.js';

const paymentRouter = express.Router()
const stripe = Stripe(process.env.STRIPE_API_KEY);

paymentRouter.get('/upgrade', (req, res) => {
    res.render('upgrade.ejs');
})

paymentRouter.get('/upgrade/success', async (req, res) => {
    //update user premium status when payment successful
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        upgradeUser(session.metadata.user_id);
    } catch (error) {
        console.log(error.message);
        return res.status(401).redirect('/');
    }
    res.render('success.ejs');
})

paymentRouter.get('/upgrade/cancel', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        deleteUser(session.metadata.user_id);
    } catch (error) {
        console.log(error.message);
        return res.status(401).redirect('/');
    }
    res.render('cancel.ejs');
})

paymentRouter.post('/upgrade', registerValidation, async (req,res) => {
    const {username, password} = req.body;
    const user_id = await addNewUser({username, password});

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        metadata: {user_id},
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'JBZ Converter Lifetime Member',
                        description: 'You can use unlimited number of converts',
                    },
                    unit_amount: 15 * 100,
                },
                quantity: 1,
            },
        ],
        success_url: "http://localhost:3000/upgrade/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/upgrade/cancel",
    })

    //as usual, HTMX has to be used to redirect because of error-info swapping
    res.set('HX-redirect', session.url);
    res.send('');
})


export default paymentRouter;