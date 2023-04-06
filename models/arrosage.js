const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    matin: {
        required: false,
        type: String
    },
    soir: {
        required: false,
        type: String
    }

    
})

module.exports = mongoose.model('arrosage', dataSchema);