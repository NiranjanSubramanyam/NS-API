const mongoose = require('mongoose');

const storeinvoiceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    AssignAmount: { type: String, required: true },
    InvoiceDate: { type: String, required: true },
    Store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    DueDate: { type: String, required: false },
    Collector: { type: String, required: false },
    Plan: { type: String, required: false }    
});

module.exports = mongoose.model('StoreInvoice', storeinvoiceSchema);