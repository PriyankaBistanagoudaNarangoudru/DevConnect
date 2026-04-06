const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    senderUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiverUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: ' {VALUE} is not a valid status value'
        },
    },
},
    { timestamps: true });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest; 