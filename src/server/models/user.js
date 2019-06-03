const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = require('../env').secret;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().indexOf('password') >= 0) {
                throw new Error('Password may not contain \'password\'');
            }
        }
    }
});

// Hash password on save
userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password); 
        if (passwordMatch) {
            return user;
        }
    }
    throw new Error('Invalid email or password');            
}

userSchema.methods.generateAccessToken = async function() {
    const user = this;
    const token = await jwt.sign({_id: user._id}, secret, {expiresIn: '7 days'});
    return token;
}

// Overridden function
userSchema.methods.toJSON = function() {
    const user = this;
    const userView = user.toObject();
    delete userView.password;
    return userView;
}

const User = mongoose.model('User', userSchema);

module.exports = User;