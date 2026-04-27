const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl about';

userRouter.get('/user/requests', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const requests = await ConnectionRequest.find({
            receiverUserId: loggedInUserId, status: 'interested'
        }).populate('senderUserId', USER_SAFE_DATA);
        res.json({ message: 'Connection requests fetched successfully!', requests });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const connections = await ConnectionRequest.find({
            $or: [
                { senderUserId: loggedInUserId, status: 'accepted' },
                { receiverUserId: loggedInUserId, status: 'accepted' }
            ]
        }).populate('senderUserId receiverUserId', USER_SAFE_DATA);

        const userConnections = connections.map(connection => {
            if (connection.senderUserId._id.equals(loggedInUserId)) {
                return connection.receiverUserId;
            }
            return connection.senderUserId;
        });
        res.json({ message: 'Connections fetched successfully!', userConnections });
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = userRouter;