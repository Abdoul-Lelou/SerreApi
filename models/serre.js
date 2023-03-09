const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({
    tempSerre: {
        required: false,
        type: Number
    },
    humSerre: {
        required: false,
        type: Number
    },
   
    humSol: {
        required: false,
        type: Number
    },
    
})

module.exports = mongoose.model('serre', dataSchema);