const mongoose = require('mongoose');

const skuMasterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    itemcode: { type: String, required: false },
    itemname: { type: String, required: false },
    categoryname: { type: String, required: false },
    manufacturername: { type: String, required: false },
    mrp: { type: String, required: false },
    itemlist: [],
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreUser', required: true }    
});

module.exports = mongoose.model('SKUMaster', skuMasterSchema);