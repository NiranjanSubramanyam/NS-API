const mongoose = require('mongoose');

const temporderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    orderedby: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    uniquename: { type: String, required: false },
    tempOrderDateTime: { type: String, required: false },
    cartItems: []    
});

module.exports = mongoose.model('TempOrder', temporderSchema);