const mongoose = require('mongoose');

const helpSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    HelpTitle: { type: String, required: true },
    HelpContent1: { type: String, required: false },
    HelpContent2: { type: String, required: false },
    HelpContent3: { type: String, required: false },
    HelpContent4: { type: String, required: false },
    HelpContent5: { type: String, required: false },
    HelpContent6: { type: String, required: false },
    HelpAudience: { type: String, required: false },
    Status: { type: String, required: false }
});

module.exports = mongoose.model('Help', helpSchema);