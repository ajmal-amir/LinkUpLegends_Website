//rsvpRouts.js

const express = require('express');
const router = express.Router();
const rsvpController = require('../controllers/rsvpController');
const {validateResult} = require('../middleware/validator')

// Create RSVP
// Assuming eventId is available in the request body
router.post('/events/:eventId/rsvp', validateResult, rsvpController.createRSVP);



// Update RSVP
router.put('/events/:eventId/rsvp', rsvpController.updateRSVP);


// Delete RSVP
// router.delete('/rsvps/:rsvpId', rsvpController.deleteRSVP);

module.exports = router;
