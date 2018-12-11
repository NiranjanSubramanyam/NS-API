const mongoose = require('mongoose');

const advertisementsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    AdvertisementTag: { type: String, required: true }, // Advertisement, Promotion, Deal of the Day
    AdvertisementName: { type: String, required: true },
    AdvertisementImagePath: { type: String, required: false },
    Status: { type: String, required: false },
    DisplayOrder: { type: String, required: false }
});

module.exports = mongoose.model('Advertisements', advertisementsSchema);