//events.js
const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: [true, 'Title is required'] },
    host: { type: Schema.Types.ObjectId, ref: 'User' },
    details: { type: String, required: [true, 'Details are required'] },
    where: { type: String, required: [true, 'Location is required'] },
    start: { type: Date, required: [true, 'Start time is required'] },
    end: { type: Date, required: [true, 'End time is required'] },
    date: { type: String, default: DateTime.now().toLocaleString(DateTime.DATE_FULL) },
    cost: { type: String, required: [true, 'Cost information is required'] },
    image: { type: String, required: [true, 'Image URL is required'] },
    category: { type: String, required: [true, 'Category is required'] },
    rsvps: [{ type: Schema.Types.ObjectId, ref: 'RSVP' }] // Reference to RSVP model
});

module.exports = mongoose.model('Event', eventSchema);

