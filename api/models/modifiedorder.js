const mongoose = require('mongoose');

const modifiedOrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    OrderNo: { type: String, required: true },
    OrderDate: { type: String, required: true },
    OrderedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreUser', required: true },
    OrderedByName: { type: String, required: false },
    CustomerContactNo: { type: String, required: false },
    CustomerName: { type: String, required: false },
    Status: { type: String, required: false },
    OrderTotal: { type: String, required: true },
    Discount: { type: String, required: false },
    Voucher: { type: String, required: false },
    Store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    StoreName: {type: String, required: false },
    PaymentMode: { type: String, required: true },
    PaymentType: { type: String, required: false },
    AdminNotes: { type: String, required: false },
    OrderLogs: { type: String, required: false },
    OrderMode: { type: String, required: false },
    ModificationFlag: { type: Number, required: false }, //0 = just a copy, 1 = order modified
    ModifiedDate: { type: String, required: false },
    ItemDetails: []    
});

module.exports = mongoose.model('ModifiedOrder', modifiedOrderSchema);