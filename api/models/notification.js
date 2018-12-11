const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    notificationname: { type: String, required: true },
    notificationproductname: { type: String, required: false },
    notificationproductcode: { type: String, required: false },
    notificationmessageheader: { type: String, required: false },
    notificationmessagebody: { type: String, required: false },
    notificationaction: { type: String, required: false },
    notificationtype: { type: String, required: false },
    storeid: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: false },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreUser', required: false },
    notificationstatus: { type: String, required: false }
});

module.exports = mongoose.model('Notification', notificationSchema);