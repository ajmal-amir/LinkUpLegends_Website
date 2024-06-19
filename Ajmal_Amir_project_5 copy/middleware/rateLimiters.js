const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowMs:  60 * 1000, // one minut time window
    max: 5, 
    // message: 'Too many login requests. Try again later'
    handler: (req, res, next) => {
        let err = new Error("Too many login requests. Try again later");
        err.status = 429;
        return next(err); 
    }
}); 
// Since this is a user login requiest we going to call it in the user rout. 