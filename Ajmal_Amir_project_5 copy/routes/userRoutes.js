// userRoutes.js
const express = require("express");
const router = express.Router();
const controller = require('../controllers/userController');
const {isGuest} = require('../middleware/auth')
const {isLoggedIn} = require('../middleware/auth')
const {logInLimiter} = require('../middleware/rateLimiters')
const {validateSignUp, validateLogIn, validateResult} = require('../middleware/validator')

router.get("/signup", isGuest, controller.signup);

router.post("/signup", isGuest, validateSignUp, validateResult, controller.signupPost);

router.get("/login", isGuest,  controller.login);



router.post("/login",logInLimiter, isGuest,validateLogIn,  validateResult, controller.postLogin);
// validateLogIn, is cassing the isseu 

router.get("/logout", isLoggedIn, controller.logout); // Add this line for the logout route

router.get("/profile", isLoggedIn, controller.profile);

router.post("/", (req, res, next) => {
    console.log(req.body); // Log the request body for debugging
    controller.signupPost(req, res, next); // Call the signupPost function to handle the form submission
});

module.exports = router;
