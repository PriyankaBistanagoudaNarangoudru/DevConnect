const adminAuth = (req, res, next) => {
    const token = 'authorised';
    const isAuthorised = token === 'authorised';
    if(!isAuthorised) {
        res.status(401).send('Unauthorised request');
    } else {
        next();
    }
}

const userAuth = (req, res, next) => {
    console.log('User Auth');
    const token = 'user authorised';
    const isAuthorised = token === 'user authorised';
    if(!isAuthorised) {
        res.status(401).send('Unauthorised request');
    } else {
        next();
    }
}

module.exports = {
    adminAuth,
    userAuth
}