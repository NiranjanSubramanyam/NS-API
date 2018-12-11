const mongoose = require('mongoose');

const globalofferSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    couponcode: { type: String, required: true },
    couponname: { type: String, required: true },
    offermode: { type: String, required: false }, //cash or percentage
    offerpercent: { type: String, required: false }, // saved when percentage is selected
    offercash: { type: String, required: false }, // saved when cash is selected
    offervalue: { type: String, required: false }, //This will have either cash or percentage value only for representation purposes in fronend
    status: { type: String, required: true },
    fromdate: { type: String, required: true },
    todate: { type: String, required: true },
    offerdescription: { type: String, required: true }    
});

module.exports = mongoose.model('GlobalOffer', globalofferSchema);