const mongoose = require('mongoose');

const creditCustomerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customername: { type: String, required: true },
    mobileno: { type: Number, required: true },
    completeaddress: { type: String, required: false },
    aadharno: { type: String, required: false },
    storeid: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: false },
    status: { type: Number, required: false },
    customercredits: [],
    currentcredit: { type: Number, required: false },
    creditpaidtilldate: { type: String, required: false },
    paymenthistory: [],
    lastpaiddate: { type: String, required: false },
    paymentmode: { type: String, required: false }
});

module.exports = mongoose.model('CreditCustomer', creditCustomerSchema);