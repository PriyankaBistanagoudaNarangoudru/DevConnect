const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validateSignUpData');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

const app = express();
app.use(cookieParser());
app.use(express.json());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.get('/profile', userAuth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(`Connection request sent successfully by ${user.firstName} ${user.lastName} :)`);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

connectDB().then(() => {
    console.log('Successfully connected to DB');
    app.listen(3000, () => {
        console.log('Server is running successfully on port 3000!');
    });
}).catch((err) => {
    console.error('There was an error in connecting the database: ', err);
})


