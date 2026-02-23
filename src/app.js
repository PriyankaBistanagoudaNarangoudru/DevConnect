const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.get('/getUserByEmail', async (req, res) => {
    try {
        const user =  await User.findOne({emailId: req.body.emailId});
        res.send(user);
    } catch(err) {
        res.status(400).send('Something went wrong!!');
    }  
})

app.get('/getUsers', async (req, res) => {
    try {
        const users =  await User.find({});
        res.send(users);
    } catch(err) {
        res.status(400).send('Something went wrong!!');
    }   
})

app.post('/signup', (req, res) => {
    const user = new User(req.body);
    user.save();
    res.send('User added successfully!');
})

connectDB().then(() => {
    console.log('Successfully connected to DB');
    app.listen(3000, () => {
    console.log('Server is running successfully on port 3000!');
});
}).catch((err) => {
    console.error('There was an error in connecting the database: ', err);
})


