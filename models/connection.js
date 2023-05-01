const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    title: {type: String, required: [true, 'Title is required.']},
    topic: {type: String, required: [true, 'Topic is required.']},
    details: {type: String, required: [true, 'Details are required.'], 
            minLength: [10, 'The details should have at least 10 characters.']},
    location: {type: String, required: [true, 'Location is required.']},
    date: {type: String, required: [true, 'Date is required.']},
    start: {type: String, required: [true, 'Start is required.']},
    end: {type: String, required: [true, 'End is required.']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    image: {type: String, required: [true, 'Image URL is required.']},
},
{timestamps: true}
);

//collection name is connections in database
module.exports = mongoose.model('Connection', connectionSchema);