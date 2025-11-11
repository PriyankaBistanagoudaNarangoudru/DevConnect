const express = require('express');

const app = express();

const { adminAuth, userAuth } = require('./middlewares/auth')

app.listen(3000, () => {
console.log('Server is running successfully on port 3000!');
});

app.use('/admin', adminAuth);

app.get('/admin/allData', (req, res) => {
    res.send('All data sent successfully');
});

app.get('/admin/deleteUser', (req, res) => {
    res.send('User deleted successfully');
});

app.post('/user/login', (req, res) => {
    res.send('User logged in successfully');
})

app.get('/user/getUser', userAuth, (req, res) => {
    res.send('Fetched user data');
})
