const mongoose = require('mongoose');

const customerAddressSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    addresstype: { type: String, required: true },
    fullname: { type: String, required: true },
    mobilenumber: { type: String, required: true },
    pincode: { type: String, required: true },
    flathouseno: { type: String, required: true },
    areacolony: { type: String, required: true },
    landmark: { type: String, required: true },
    towncity: { type: String, required: true },
    state: { type: String, required: true },
    specialinstructions: { type: String, required: false }
    
});

module.exports = mongoose.model('CustomerAddress', customerAddressSchema);