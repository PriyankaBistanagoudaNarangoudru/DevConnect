const express = require('express');
const { validateSignUpData } = require('../utils/validateSignUpData');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const authRouter = express.Router();


authRouter.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;
        //validate sign up data
        validateSignUpData(req);
        // encrypt password
        const passwordHash = await bcrypt.hash(password, 10);
        //save user to database
        const user = new User({ firstName, lastName, emailId, password: passwordHash });
        await user.save();
        res.send('User added successfully!');
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }

})

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });

        if (!user) {
            throw new Error('Invalid credentials!');
        }
        const isMatch = await user.validatePassword(password);
        if (isMatch) {
            const token = user.getJWTToken();
            res.cookie('token', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true });
        } else {
            throw new Error('Invalid credentials!');
        }
        res.send('Login successful!');
    } catch (err) {
        res.status(400).send('Login unsuccessful!!! ' + err.message);
    }
})

authRouter.post('/logout', (req, res) => {
    res.cookie('token', null,
        { expires: new Date(Date.now())}
    )
    res.send('Logout successful!');
});

module.exports = authRouter;

