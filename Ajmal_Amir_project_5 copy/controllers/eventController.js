//eventController.js
const model = require('../models/event');
const Event = require('../models/event');

const { DateTime } = require("luxon");
const { v4: uuidv4 } = require('uuid'); // Import uuidv4
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const exp = require('constants');
const event = require('../models/event');
const session = require('express-session');
const RSVP = require('../models/rsvp');
const upload = multer().none(); // This parses the form data without handling file uploads

exports.index = (req, res) => {
    let events = model.find().populate('host')
    .then (events=> res.render('./events/index', { events }))
    .catch(err=>next(err));
};

exports.newconnection = (req, res) => {
    res.render('./events/newconnection');
}

exports.create = (req, res, next) => {
    console.log(req.body); // Check the form data in the console
    
    let image = "";
    if (req.file) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `image-${uniqueSuffix}.png`; // Generate a filename
        const imagePath = path.join(__dirname, '../public/uploads/', filename); // Specify the file path
        fs.renameSync(req.file.path, imagePath); // Move the uploaded file to the specified path
        image = './uploads/' + filename; // Use the image path relative to the public folder
    }

    // let startDateTime = DateTime.fromISO(req.body.Start).toLocaleString(DateTime.TIME_SIMPLE);
    // let endDateTime = DateTime.fromISO(req.body.End).toLocaleString(DateTime.TIME_SIMPLE);
    let date = DateTime.fromISO(req.body.End).toLocaleString(DateTime.DATE_FULL);

    let event = new Event({  // Create a new Event instance
        category: req.body.Category,
        title: req.body.Title,
        host: req.body.host,
        details: req.body.Details,
        where: req.body.location,
        start: req.body.Start,
        end: req.body.End,
        date: date,
        cost: req.body.cost,
        image: image
    });
    event.host = req.session.user; 
    event.save()  // Save the new event
        .then(result => res.redirect('/events'))
        .catch(err =>{
            if (err.name === 'ValidationError'){
                err.status = 400; 
            }
            next(err);
        });
}



exports.show = (req, res, next) => {
    let id = req.params.id;
    let user = req.session.user
    console.log("User id is: "+ user)
    model.findById(id)
        .populate('host') // Populate the 'host' field
        .populate('rsvps')
        .then(event => {
            if (event) {
                // console.log(event);
                res.render('./events/show', { event: event, user });
            } else {
                let err = new Error(`Can't find story with id ${req.params.id}`);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};


exports.edit = (req, res, next) => {
    let id = req.params.id; 
     model.findById(id)
    .then(event=>{
        if(event){
            res.render('./events/edit', { event: event });
        }else{
            let err = new Error(`Can't find  story with id ${req.params.id}`);
            err.status = 404; 
            next(err);
        }
    })
    .catch(err=>next(err));
};




exports.update = (req, res, next) => {
    let id = req.params.id;

    let image = "";
    if (req.file) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `image-${uniqueSuffix}.png`; // Generate a filename
        const imagePath = path.join(__dirname, '../public/uploads/', filename); // Specify the file path
        fs.renameSync(req.file.path, imagePath); // Move the uploaded file to the specified path
        image = './uploads/' + filename; // Use the image path relative to the public folder
    }

    let updatedEvent = {
        title: req.body.title,
        host: req.body.host,
        details: req.body.details,
        where: req.body.where,
        start: req.body.start,
        end: req.body.end,
        date: req.body.date,
        cost: req.body.cost,
        category: req.body.category
    };

    // Only update the image if req.file exists (image has been changed)
    if (req.file) {
        updatedEvent.image = image;
    }

    model.findByIdAndUpdate(id, updatedEvent, { new: true })
        .then(result => {
            if (result) {
                res.redirect('/events/' + id);
            } else {
                let err = new Error(`Can't find event with id ${req.params.id}`);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};




exports.delete = (req, res, next) => {
    let id = req.params.id;
    RSVP.deleteMany({ event: id }) // Delete all RSVPs for the event
        .then(() => {
            return model.findByIdAndDelete(id, { useFindAndModify: false });
        })
        .then(event => {
            if (event) {
                res.redirect('/user/profile');
            } else {
                let err = new Error(`Can't find event with id ${req.params.id}`);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if (err.name === "validationError") {
                err.status = 400;
                next(err);
            }
        });
};

