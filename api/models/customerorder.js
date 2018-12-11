const mongoose = require('mongoose');

const customerOrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    OrderNo: { type: String, required: true },
    OrderDate: { type: String, required: true },
    OrderedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    ContactNo: { type: String, required: true },
    DeliveryDate: { type: String, required: true },
    DeliveryAddress: { type: String, required: true },
    Status: { type: String, required: false },
    OrderTotal: { type: String, required: true },
    Voucher: { type: String, required: false },
    DeliveryFee: { type: String, required: true },
    Store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    StoreName: {type: String, required: true },
    PaymentMode: { type: String, required: true},
    OrderedByName: { type: String, required: true},
    SpecialInstructions: { type: String, required: false },
    AdminNotes: { type: String, required: false },
    OrderLogs: { type: String, required: false },
    DeliveryDetail: []    
});

module.exports = mongoose.model('CustomerOrder', customerOrderSchema);