
const errorHandler = (err, req, res, next) => {
    // set status to 500 if status is 200
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // if error is a CastError
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';

    };

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
}

module.exports = {  errorHandler };

