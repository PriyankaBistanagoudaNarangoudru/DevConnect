const express = require('express');
const { userAuth } = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(`Connection request sent successfully by ${user.firstName} ${user.lastName} :)`);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = requestRouter;