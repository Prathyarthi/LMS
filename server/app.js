const cookieParser = require('cookie-parser');
const express = require('express');
const userRoutes = require('./routes/user.routes')
const cors = require('cors');
const errorMiddleware = require('./middleware/errorMiddleware');
const morgan = require('morgan');

const app = express();

app.use(express.json());

// To use/access the FRONTEND part
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(morgan('dev'));    // morgan package is used to check the logs like what the user has done
// The parameter 'dev' means what types of logs we want to see, there are many other parameters like short,combined etc

// To parse the token present in cookie
app.use(cookieParser());

app.use('/api/v1/user', userRoutes);

app.all('*', (req, res) => {
    res.status(404).send("Oops! 404 Page not found!");
})

// Code for next() -> generic middleware 
app.use(errorMiddleware);

module.exports = app;