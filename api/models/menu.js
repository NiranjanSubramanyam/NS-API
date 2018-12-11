const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    KitchenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kitchen', required: true },
    KitchenName: String,
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    MenuName: String,
    MenuDescription: String,
    MaxServableQty: Number,
    VegNonVeg: String,
    CuisineType: String,
    MenuCategory: String,
    MenuPrice: String,
    Weight: String,
    Discount: String,
    MenuImage: String,
    Status: String
});

module.exports = mongoose.model('Menu', menuSchema);