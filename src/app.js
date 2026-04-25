const express = require('express');
const connectDB = require('./config/database');
require('./utils/validateSignUpData');

const cookieParser = require('cookie-parser');
require('./middlewares/auth');

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/', require('./routes/authRouter'));
app.use('/', require('./routes/profileRouter'));
app.use('/', require('./routes/requestRouter'));
app.use('/', require('./routes/userRouter'));

connectDB().then(() => {
    console.log('Successfully connected to DB');
    app.listen(3000, () => {
        console.log('Server is running successfully on port 3000!');
    });
}).catch((err) => {
    console.error('There was an error in connecting the database: ', err);
})


