const { body, validationResult } = require('express-validator');

exports.validateID = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection ID');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}

exports.validateConnection = [body('title', 'Title cannot be empty').notEmpty().trim().escape(),
body('topic', 'Topic cannot be empty').notEmpty().trim().escape(),
body('details', 'Details must be at least 10 characters').isLength({min: 10}).trim().escape(),
body('location', 'Location cannot be empty').notEmpty().trim().escape(),
body('date', 'Date cannot be empty').notEmpty().trim().escape(),
body('date', 'Date must be in a valid format').isDate().trim().escape(),
body('date', 'Date must be after today\'s date').isAfter(new Date().toDateString()).trim().escape(),
body('start', 'Start cannot be empty').notEmpty().trim().escape().matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/),
body('end', 'End cannot be empty').notEmpty().trim().escape().matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).custom((endTime, { req }) => {
    //end time must come after start time
    if (endTime <= req.body.start) {
        req.flash('error', 'End time must be after start time.')
    }
    return true;
}),
body('image', 'Image URL cannot be empty').notEmpty().trim().escape()];

exports.validateRsvp = [body('rsvpbutton', 'Response cannot be empty.').notEmpty().trim().escape(),
body('rsvpbutton', 'Response must be yes, maybe, or no').toUpperCase().isIn(['YES', 'MAYBE', 'NO'])];