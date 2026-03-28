const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
        try
        {
            const cookie = req.cookies;
        const token = cookie.token;
        if (!token) {
            throw new Error('Please login to access this resource!');
        }
        const decoded = jwt.verify(token, 'PrivateKey@1234');
        const { _id } = decoded;
        const user = await User.findById(_id);
        req.user = user;
        next();}
        catch(err) {
            res.status(401).send(err.message);
        }
}

module.exports = {
    userAuth
}