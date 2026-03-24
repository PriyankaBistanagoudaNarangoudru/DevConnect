const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
        unique:true,
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        unique: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if(!["male", "female", "other"].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    about: {
        type: String,
        default: "This is default about of the user."
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7POK_idatKUMYk38e6dBxzTfTSlqSwsT5iw&s",
    },
    skills: {
        type: [String],
        default: ["JavaScript"],
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);