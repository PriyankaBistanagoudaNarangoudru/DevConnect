const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.use(express.json());

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


