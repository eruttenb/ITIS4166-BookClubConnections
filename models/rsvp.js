const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    connection: {type: Schema.Types.ObjectId, ref: 'Connection'},
    response: {type: String, required: [true, 'Response cannot be empty.']}
});

module.exports = mongoose.model('Rsvp', rsvpSchema);