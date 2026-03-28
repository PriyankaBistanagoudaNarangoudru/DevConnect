const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid:'+ value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Password is not strong: '+ value)
            }
        }
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
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error('Photo URL is not valid: '+ value);
            }
        }
    },
    skills: {
        type: [String],
        default: ["JavaScript"],
    }
}, {
    timestamps: true
});

userSchema.methods.getJWTToken = function() {
    const user = this;
    const token = jwt.sign({_id: user._id}, 'PrivateKey@1234', {expiresIn: '1d'});

    return token;
}

userSchema.methods.validatePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

module.exports = mongoose.model('User', userSchema);