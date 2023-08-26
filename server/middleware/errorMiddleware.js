const errorMiddleware = (error, req, es, next) => {
    req.statusCode = req.statusCode || 500;
    req.message = req.message || "Something went wrong";
    res.status().json({
        success: false,
        mesage: req.message,
        stack: error.stack
    });
}

module.exports = errorMiddleware;