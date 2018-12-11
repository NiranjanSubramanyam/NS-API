const mongoose = require('mongoose');

const serviceZoneSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    AreaName: { type: String, required: true },
    StoreName: { type: String, required: false },
    StoreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    Status: { type: Number, required: true }
});

module.exports = mongoose.model('ServiceZone', serviceZoneSchema);