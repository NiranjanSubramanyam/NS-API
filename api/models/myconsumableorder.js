const mongoose = require('mongoose');

const myConsumableOrderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    KitchenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kitchen', required: true },
    KitchenName: String,
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ConsumableName: String,
    OrderedQuantity: String,
    RequestedDate: String
});

module.exports = mongoose.model('MyConsumableOrderRequest', myConsumableOrderSchema);