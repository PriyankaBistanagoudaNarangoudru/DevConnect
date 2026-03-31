const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validateSignUpData');

const profileRouter = express.Router();

profileRouter.get('/view', userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

profileRouter.patch('/edit', userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            throw new Error('Invalid edit fields!');
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((field) => loggedInUser[field] = req.body[field]);
        await loggedInUser.save();
        res.json({
            message: 'Profile updated successfully!',
            user: loggedInUser
        })
    } catch (err) {
        res.status(400).send(err.message);
    }
})

module.exports = profileRouter;