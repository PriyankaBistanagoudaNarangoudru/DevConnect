const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

userRouter.get('/user/requests', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const requests = await ConnectionRequest.find({ receiverUserId: loggedInUserId, status: 'interested'}).populate('senderUserId', 'firstName lastName photoUrl');
        res.json({ message: 'Connection requests fetched successfully!', requests});
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = userRouter;