const express = require('express');
const path = require('path');
const fs = require('fs');

require('./db/mongoose');

const userRouter = require('./routers/user');
const daylogRouter = require('./routers/daylog');
const tasklistRouter = require('./routers/tasklist');

const app = express();
const port = process.env.PORT || 3000;

// define middleware method
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,PATCH,DELETE,HEAD");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
//production mode
if (process.env.NODE_ENV === 'production') {
    console.log(__dirname);
    fs.readdir('.', function(err, items) {
        console.log(items);
    });
    app.use(express.static('build'));
    app.use('/roelver/timelogg-react/static/js', express.static('build/static/js'));
    app.use('/roelver/timelogg-react/static/css', express.static('build/static/css'));
    app.get('/', (req, res) => {
        res.sendFile('build/index.html');
    })
}

app.use(express.json());
app.use(userRouter);
app.use(daylogRouter);
app.use(tasklistRouter);

app.listen(port, () => {
    console.log('Server is listening to port', port);
});
