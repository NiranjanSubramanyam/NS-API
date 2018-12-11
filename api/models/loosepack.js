const mongoose = require('mongoose');

const loosePacksSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    itemcode: { type: String, required: false },
    itemname: { type: String, required: false },
    itemunit: { type: String, required: false },
    quantity: { type: Number, reuired: false },
    itemcategory: { type: String, required: false },
    manufacturername: { type: String, required: false },
    mrp: { type: String, required: false },
    status: { type: String, required: false }, //1 = active, 2 = inactive
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreUser', required: false },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: false },
    storename: {type: String, required: false },
    costprice: {type: String, required: false },
    sellingprice: {type: String, required: false },
    discount: {type: String, required: false },
    weight: {type: String, required: false }
});

module.exports = mongoose.model('LoosePacks', loosePacksSchema);