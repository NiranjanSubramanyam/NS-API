const mongoose = require('mongoose');

const websiteSettingsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ApplicationName: { type: String, required: true },
    WebsiteUrl: { type: String, required: true },
    GoogleAnalyticsCode: { type: String, required: false },
    MetaTag1: { type: String, required: false },
    MetaTag2: { type: String, required: false },
    MetaTag3: { type: String, required: false },
    FacebookLink: { type: String, required: false },
    TwitterLink: { type: String, required: false },
    GooglePlusLink: { type: String, required: false },
    InstagramLink: { type: String, required: false },
    LinkedInLink: { type: String, required: false },
    AdminEmailId: { type: String, required: false },
    HelpdeskEmailId: { type: String, required: false },
    EscalationEmailId: { type: String, required: false },
    ContactPhone1: { type: String, required: false },
    ContactPhone2: { type: String, required: false },
    Address: { type: String, required: false },
    StateGST: { type: String, required: false },
    CentralGST: { type: String, required: false }
});

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);