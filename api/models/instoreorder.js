const mongoose = require('mongoose');

const inStoreOrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    OrderNo: { type: String, required: false },
    OrderDate: { type: String, required: false },
    OrderedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreUser', required: false },
    OrderedByName: { type: String, required: false },
    CustomerContactNo: { type: String, required: false },
    CustomerName: { type: String, required: false },
    Status: { type: String, required: false },
    OrderTotal: { type: String, required: false },
    Discount: { type: String, required: false },
    Voucher: { type: String, required: false },
    Store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: false },
    StoreName: { type: String, required: false },
    PaymentMode: { type: String, required: false },
    PaymentType: { type: String, required: false },
    AdminNotes: { type: String, required: false },
    OrderLogs: { type: String, required: false },
    OrderMode: { type: String, required: false },
    IsOrderModified: { type: Number, required: false }, // 0 = not modified, 1 = modified
    ModifiedDate: { type: String, required: false },
    ModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreUser', required: false },
    ModifiedByName: { type: String, required: false },
    ItemDetails: []
});

module.exports = mongoose.model('InStoreOrder', inStoreOrderSchema);