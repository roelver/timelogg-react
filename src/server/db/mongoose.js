const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/timelogg-api';
console.log('Connecting to Mongo on', mongoUrl );
mongoose.connect(mongoUrl,
    {
        useNewUrlParser: true, 
        useCreateIndex: true
    }
);
