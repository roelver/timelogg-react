const express = require('express');

require('./db/mongoose');

const userRouter = require('./routers/user');
// const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

// define middleware method
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

app.use(express.json());
app.use(userRouter);
// app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is listening to port', port);
});
