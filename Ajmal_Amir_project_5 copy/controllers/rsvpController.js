const RSVP = require('../models/rsvp');
const Event = require('../models/event');
const event = require('../models/event');



exports.createRSVP = async (req, res, next) => {
    try {
        const eventId = req.params.eventId; // Get the eventId from the URL params
        const userId = req.session.user;
        const status = req.body.status; // Assuming status is also sent in the request body

        // Check if the user is the creator of the event
        const event = await Event.findById(eventId);
        if (event.host.equals(userId)) {
            req.flash('error', 'You are the creator of this event and cannot RSVP.');
            return res.redirect('back');
        }

        // Find the existing RSVP for this user and event
        let rsvp = await RSVP.findOne({ user: userId, event: eventId });

        // If the RSVP exists and status is 'YES', show an error
        if (rsvp && rsvp.status === 'YES') {
            req.flash('error', 'You have already RSVP\'d for this event. You do not need to do it again!');
            return res.redirect('back');
        }

        // If the RSVP exists, update its status to 'YES'
        if (rsvp) {
            rsvp.status = 'YES';
        } else {
            // Otherwise, create a new RSVP
            rsvp = new RSVP({
                user: userId,
                event: eventId,
                status: status
            });
        }

        // Save the updated or new RSVP
        await rsvp.save();

        // Update total 'YES' RSVPs for the event
        if (status === 'YES' && !event.rsvps.includes(rsvp._id)) {
            event.rsvps.push(rsvp._id);
            await event.save();
        }

        res.redirect('/user/profile');
    } catch (err) {
        req.flash('error', err.message); // Add this line to handle errors
        res.redirect('back');
    }
};









exports.updateRSVP = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const userId = req.session.user;
        const status = req.body.status;

        // Check if the user is the creator of the event
        const eventHost = await Event.findById(eventId);
        if (eventHost.host.equals(userId)) {
            req.flash('error', 'You are the creator of this event and cannot change RSVP status');
            return res.redirect('back');
        }

        // Find the RSVP by user and event ID
        const rsvp = await RSVP.findOne({ user: userId, event: eventId });

        if (!rsvp) {
            return res.status(404).json({ message: 'RSVP not found' });
        }

        // Update the RSVP status
        rsvp.status = status;
        await rsvp.save();

        // Update total 'YES' RSVPs for the event
        const event = await Event.findById(eventId);
        if (status === 'NO' || status === 'MAYBE') {
            event.rsvps.pull(rsvp._id);
        } else if (status === 'YES') {
            event.rsvps.push(rsvp._id);
        }
        await event.save();

        res.redirect('/user/profile');
    } catch (err) {
        next(err);
    }
};

