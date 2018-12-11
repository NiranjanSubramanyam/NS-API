const mongoose = require('mongoose');

const emailnotificationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    anonymousname: { type: String, required: false },
    anonymousemail: { type: String, required: false },
    anonymousphone: { type: String, required: false },
    anonymousmessage: { type: String, required: false },
    messagesentdate: { type: String, required: false },
    status: { type: String, required: false },
    responded: { type: String, required: false },
    responsemessage: { type: String, required: false }    
});

module.exports = mongoose.model('EmailNotification', emailnotificationSchema);