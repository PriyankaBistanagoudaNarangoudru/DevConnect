const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const {validateSignUpData} = require('./utils/validateSignUpData');
const bcrypt = require('bcrypt');
const app = express();

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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials!');
        }
        res.send('Login successful!');
    } catch (err) {
        res.status(400).send('Login unsuccessful!!! ' + err.message);
    }
})

app.get('/getUserByEmail', async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        res.send(user);
    } catch (err) {
        res.status(400).send('Something went wrong!!');
    }
})

app.get('/getUsers', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send('Something went wrong!!');
    }
})

app.delete('/deleteUser', async (req, res) => {
    const userId = req.body._id;
    try {
        const users = await User.findByIdAndDelete(userId);
        res.send('User deleted successfully');
    } catch (err) {
        res.status(400).send('Something went wrong');
    }
})

const ALLOWED_UPDATES = ["_id", "skills", "firstName", "lastName", "about", "photoUrl"];
app.patch('/updateUser', async (req, res) => {
    const userId = req.body._id;
    const data = req.body;
    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

    try {
        if (!isUpdateAllowed) {
            throw new Error('Update is not allowed.');
        }
        if (data.skills.length > 10) {
            throw new Error('Skills cannot be more than 10.')
        }
        const users = await User.findByIdAndUpdate(userId, data, { runValidators: true });

        res.send('User updated successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
})

app.patch('/updateUserByEmailId', async (req, res) => {
    const emailId = req.body.emailId;
    const data = req.body;
    try {
        console.log(data);
        await User.findOneAndUpdate({ emailId: emailId }, data, { runValidators: true });
        res.send('User updated successfully');
    } catch (error) {
        res.status(400).send('Unable to update user!');
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


