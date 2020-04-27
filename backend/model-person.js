const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const personSchema = new Schema ({
    user_id: { type: String, required: true},
    name:    { type: String, required: true},
    photos:  [{ type: mongoose.Types.ObjectId, ref: 'Photo' }]
});


module.exports = mongoose.model('Person', personSchema);
