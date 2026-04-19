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

connectionRequestSchema.index({ senderUserId: 1, receiverUserId: 1});

connectionRequestSchema.pre('save', function (next) {
    if(this.receiverUserId.equals(this.senderUserId)) {
        throw new Error('You cannot send a connection request to yourself!');
    }
    next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest; 