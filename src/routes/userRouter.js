const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
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
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const loggedInUserId = req.user._id;
        const connections = await ConnectionRequest.find({
            $or: [{senderUserId: loggedInUserId},
                {receiverUserId: loggedInUserId}]
        }).populate('senderUserId receiverUserId', USER_SAFE_DATA);

        const hideUsers = new Set();
        connections.forEach(connection => {
            hideUsers.add(connection.senderUserId._id.toString());
            hideUsers.add(connection.receiverUserId._id.toString());
        });
        hideUsers.add(loggedInUserId.toString());

        const userFeed = await User.find({
            _id:{ $nin: Array.from(hideUsers)}
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({ message: 'Feed fetched successfully!', userFeed: Array.from(userFeed) });

    } catch (error) {
        res.status(400).json({ errror: error.message})
    }
})

module.exports = userRouter;