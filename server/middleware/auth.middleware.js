import AppError from '../utils/appError.js';

const isLoggedIn = function (req, res, next) {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError('Unauthenticated! , please Login!', 401));
    }

    const tokenDetails = jwt.verify(token, process.env.JWT_SECRET);
    if (!tokenDetails) {
        return next(new AppError('Unauthenticated! , please Login!', 401));
    }

    req.user = tokenDetails;

    next();
}

const authorizedRoles = (...roles) => (req, res, next) => {
    const currentRole = req.user.role;
    if (!roles.includes(currentRole)) {
        return next(new AppError('You are not authorized to access this!', 403));
    }

    next();
}


const authorizedSubscriber = (req, res, next) => {
    const subscriptionStatus = req.user.subscription.status;
    const currentRole = req.user.role;
    if (currentRole !== 'ADMIN' && subscriptionStatus !== 'active') {
        return next(new AppError('Please subscribe to access this route!', 403));
    }

    next();
}

export {
    isLoggedIn,
    authorizedRoles,
    authorizedSubscriber
}