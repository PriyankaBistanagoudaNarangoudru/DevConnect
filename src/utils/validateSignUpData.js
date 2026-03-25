const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if(!firstName || !lastName || !emailId || !password) {
        throw new Error('Please provide all the required fields.');
    } else if (firstName.length < 2 || firstName.length > 30) {
        throw new Error('First name must be between 2 and 30 characters.');
    } else if (lastName.length < 2 || lastName.length > 30) {
        throw new Error('Last name must be between 2 and 30 characters.');
    } else if (!validator.isEmail(emailId)) {
        throw new Error('Please provide a valid email address.');
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Password must be a strong password.');
    }
}

module.exports = { validateSignUpData };