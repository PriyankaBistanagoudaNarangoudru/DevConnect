const express = require('express');

const app = express();

app.listen(3000, () => {
console.log('Server is running successfully on port 3000!');
});

app.get("/user/:userId", (req, res) => {
    console.log(req.params);
    res.send({
        firstaname: 'Priyanka',
        lastName: 'Narangoudru'
    });
});

app.post('/user', (req, res) => {
    res.send('User data saved to DB.');
});

app.delete('/user', (req, res) => {
    res.send('User deleted successfully!')
})

app.use("/user", (req, res) => {
    res.send('I am home page');
});