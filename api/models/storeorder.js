const mongoose = require('mongoose');

const storeorderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    orderno: { type: String, required: true },
    orderdate: { type: String, required: true },
    orderedby: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    deliverydate: { type: String, required: true },
    deliveryaddress: { type: String, required: true },
    status: { type: String, required: true },
    ordereditems: []
    
});

module.exports = mongoose.model('StoreOrder', storeorderSchema);