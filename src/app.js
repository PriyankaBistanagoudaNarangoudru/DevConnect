const express = require('express');

const app = express();

app.listen(3000, () => {
console.log('Server is running successfully on port 3000!');
});

app.use('/home', (req, res) => {
    res.send('I am home page');
});

app.use("/test", (req, res) => {
    res.send('Hi Priya from Express Server !');
});

app.use('/hello', (req, res) => {
    res.send('Hello Priya. How are you?');
});