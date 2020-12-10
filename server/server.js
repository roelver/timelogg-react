const express = require('express');

require('./db/mongoose');

const userRouter = require('./routers/user');
const daylogRouter = require('./routers/daylog');
const tasklistRouter = require('./routers/tasklist');

const app = express();

const port = process.env.PORT || 3001;

// define middleware method
app.use((req, res, next) => {
   console.log(req.method, req.path);
   next();
});

app.use((req, res, next) => {
   res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS,GET,POST,PUT,PATCH,DELETE,HEAD'
   );
   res.header('Access-Control-Allow-Origin', '*');
   res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
   );
   next();
});
//production mode: host React app from here
if (process.env.NODE_ENV === 'production') {
   console.log('Running in production!');
   app.use(express.static('server/build'));
   app.use('/entry', express.static('server/build', { index: 'index.html' }));
   app.use('/summary', express.static('server/build', { index: 'index.html' }));
   app.use('/login', express.static('server/build', { index: 'index.html' }));
   app.use('/signup', express.static('server/build', { index: 'index.html' }));
   app.use('/about', express.static('server/build', { index: 'index.html' }));
}

app.use(express.json());
app.use(userRouter);
app.use(daylogRouter);
app.use(tasklistRouter);

app.listen(port, () => {
   console.log('Server is listening to port', port);
});
