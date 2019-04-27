const jwt = require('jsonwebtoken');

const User = require('../models/user');
const secret = require('../env').secret;

const auth = async (req,res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const validTokenPayload = await jwt.verify(token, secret);
        const user = await User.findOne({ _id: validTokenPayload._id});
        if (!user) {
            throw new Error('Unknown user');            
        }
        
        req.user = user;
        next();

    } catch(e) {
        return res.status(401).send();                
    }
}

module.exports = auth;