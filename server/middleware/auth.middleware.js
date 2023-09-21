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

export {
    isLoggedIn,
    authorizedRoles
}