const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const photoSchema = new Schema({
    person_id:       { type: String, required: true },
    url:             { type: String, required: true },
    face_descriptor: []
});


module.exports = mongoose.model('Photo' , photoSchema);
