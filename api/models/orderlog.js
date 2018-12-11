const mongoose = require('mongoose');

const orderLogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    CustomerOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerOrder', required: true },
    Logs: []
    
});

module.exports = mongoose.model('OrderLog', orderLogSchema);