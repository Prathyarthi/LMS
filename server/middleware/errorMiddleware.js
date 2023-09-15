const errorMiddleware = (error, req, res, next) => {
    req.statusCode = req.statusCode || 500;
    req.message = req.message || "Something went wrong";
    res.status(req.statusCode).json({
        success: false,
        mesage: req.message,
        stack: error.stack
    });
}

export default errorMiddleware;

// const errorMiddleware = (error, req, res, next) => {
//     const statusCode = error.statusCode || 500;
//     const message = error.message || "Something went wrong";

//     res.status(statusCode).json({
//         success: false,
//         message: message,
//         stack: error.stack
//     });
// }

// export default errorMiddleware;
