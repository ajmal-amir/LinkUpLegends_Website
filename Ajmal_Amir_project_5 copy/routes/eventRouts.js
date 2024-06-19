// eventRoutes.js
const multer = require('multer');
const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventController");
const{isLoggedIn, isAuthor} = require('../middleware/auth')
const{validateId, validateEvent} = require('../middleware/validator');


const path = require('path');
const { connected } = require("process");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/imgs/events_images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.post('/', upload.single('image'), controller.create);

router.get('/', controller.index); 


// Get. /event/newconnection: sending the html form for creating a new connection 
router.get('/newconnection', isLoggedIn, validateEvent, controller.newconnection);

// Get/ events/:id send details of events identified by id
router.get('/:id', validateId, controller.show); 

//Post /events: create a new event
router.post('/', isLoggedIn, validateEvent, controller.create);

router.get('/:id/edit', validateId, isLoggedIn, isAuthor, validateEvent, controller.edit); 

router.put('/:id', validateId, isLoggedIn, isAuthor, validateEvent, controller.update);

router.put('/:id', upload.single('image'), controller.update);


// DELETE /events/:id, delete the event identified by id
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

module.exports = router; 
