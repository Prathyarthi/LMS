import cookieParser from 'cookie-parser';
import express from 'express';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/user.routes.js';
import cors from 'cors';
import errorMiddleware from './middleware/errorMiddleware.js';
import morgan from 'morgan';

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
app.use('/api/v1/courses', courseRoutes);

app.all('*', (req, res) => {
    res.status(404).send("Oops! 404 Page not found!");
})

// Code for next() -> generic middleware 
app.use(errorMiddleware);

export default app;