const mongoose = require('mongoose');

mongoose.connect('mongodb://roelver:Zaq1Xsw2@ds261486.mlab.com:61486/heroku_r1fsv87r',
    {
        useNewUrlParser: true, 
        useCreateIndex: true
    }
);
