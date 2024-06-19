// mainRouts.js
const express = require("express");

const controller = require('../controllers/mainController.js');


const router = express.Router();

router.get('/', controller.index); // Route to the index (home) page

router.get('/contact', controller.contact); // Route to the contact page

router.get('/about', controller.about); // Route to the about page


module.exports = router;
