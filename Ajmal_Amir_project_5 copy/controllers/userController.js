// userController.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Event = require('../models/event');

exports.signup = (req, res) => {
    res.render('user/signup',{ successMessages: req.flash('success'), errorMessages: req.flash('error') });
};


exports.signupPost = (req, res, next) => {
    let user = new User(req.body);
    if(user.email)
    user.email = user.email.toLowerCase(); 
    user.save()
        .then(() => {
            console.log(req.flash()); 
            req.flash('success', 'User created successfully');
            res.redirect('user/login');
        })
        .catch(err => {
            if (err.code === 11000 && err.keyPattern.email === 1) {
                console.log(req.flash()); 
                req.flash('error', 'Email already exists');
                res.redirect('user/login');
            } else {
                next(err);
            }
        });
};



exports.login = (req, res) => {
    res.render('user/login', {messageContainer: req.flash('messageContainer')});
};


exports.postLogin = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    if(email)
    email = email.toLowerCase(); 
 0
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            console.log(req.flash()); 
                            req.flash('success', 'You have successfully logged in');
                            res.redirect('/user/profile');
                        } else {
                            console.log(req.flash()); 
                            req.flash('error', 'Wrong password')
                            res.redirect('/user/login');
                        }
                    })
                    .catch(err => next(err));
            } else {
                req.flash('error', 'Wrong email address')
                res.redirect('/user/login');
            }
        })
        .catch(err => next(err));
};


const RSVP = require('../models/rsvp');

exports.profile = async (req, res, next) => {
    try {
        let id = req.session.user;
        const [user, events] = await Promise.all([
            User.findById(id),
            Event.find({ host: id }).populate('host')
        ]);

        // Fetch the user's RSVPs
        const rsvps = await RSVP.find({ user: id }).populate('event');

        res.render('user/profile', { user, events, rsvps });
    } catch (err) {
        next(err);
    }
};




exports.logout = (req, res, next) => {
    req.flash('success', 'Goodbye!');
    req.session.destroy(err => {
        if (err) {
            return next(err);
        } else {
            res.redirect('/');
        }
    });
};
