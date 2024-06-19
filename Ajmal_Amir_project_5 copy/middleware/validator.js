const{body} = require("express-validator")
const {validationResult} = require("express-validator")

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};


exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(), 
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(), 
body('email', 'Email must be a valid email adress').isEmail().trim().escape().normalizeEmail(), 
body ('password', 'Password myst be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [
    body('email', 'Email must be a valid email address').isEmail().trim().escape(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({ min: 8, max: 64 })
];



exports.validateResult = (req, res, next) => {
    let errors = validationResult(req); 
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            req.flash('error', error.msg); 
        });
        return res.redirect('back');
    } else {
        return next(); 
    }
}


exports.validateEvent = [
    body('category').custom(value => {
        const allowedCategories = ['Social', 'Sports', 'Education', 'Religious', 'Entertainment'];
        if (!validator.isIn(value, allowedCategories)) {
            throw new Error('Invalid category');
        }
        return true;
    }),
    body('start').custom(value => {
        if (!validator.isISO8601(value)) {
            throw new Error('Invalid start date');
        }
        if (!validator.isAfter(value, new Date().toISOString())) {
            throw new Error('Start date must be after today');
        }
        return true;
    }),
    body('end').custom((value, { req }) => {
        if (!validator.isISO8601(value)) {
            throw new Error('Invalid end date');
        }
        if (!validator.isAfter(value, req.body.start)) {
            throw new Error('End date must be after start date');
        }
        return true;
    }),
];