const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:receiverUserId', userAuth, async (req, res) => {
    try {
        const senderUserId = req.user._id;
        const { status, receiverUserId } = req.params;

        const allowedStatusValues = ['ignored', 'interested'];

        if(!allowedStatusValues.includes(status)) {
            return res.status(400).json({error: `Invalid status value: ${status}.`});
        }

        const receiver = await User.findById(receiverUserId);

        if(!receiver) {
            return res.status(404).json({error: 'Receiver user not found.'});
        }

        const existingRequest = await ConnectionRequest.findOne({ 
            $or: [
                { senderUserId, receiverUserId },
                { senderUserId: receiverUserId, receiverUserId: senderUserId }
            ]
         });

        if(existingRequest) {
            return res.status(400).json({error: 'A connection request already exists between these users.'});
        }

        const connectionRequest = new ConnectionRequest({ senderUserId, receiverUserId, status});
        const savedRequest = await connectionRequest.save();

        res.json({ connectionRequest: savedRequest,
            message: `Connection request sent successfully by ${req.user.firstName} ${req.user.lastName} :)`
         });
    } catch (error) {
        res.status(400).send(error.message);
    }
})

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUserId = req.user._id;
        
        const allowedStatus = ['accepted', 'rejected'];

        if(!allowedStatus.includes(status)) {
            return res.status(400).json({error: 'Status is not allowed.'});
        }

        const connectionRequest = await ConnectionRequest.findOne({ _id: requestId, receiverUserId: loggedInUserId, status: 'interested' });

        if(!connectionRequest) {
            return res.status(404).json({error: 'Connection request not found'});
        }

        connectionRequest.status = status;

        const savedRequest = await connectionRequest.save();

        res.json({ message: `Connection request is ${status}!`, connectionRequest: savedRequest});
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports = requestRouter;