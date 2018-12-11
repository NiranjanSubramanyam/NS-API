const mongoose = require('mongoose');

const StoreUserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: false, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    password: { type: String, required: false },
    mobile: { type: Number, required: true },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    completeaddress: { type: String, required: false },
    enabled: { type: Number, required: false }, //0 - not yet enabled, 1 - enabled, 2 - access provided, 3 - disabled
    comments: { type: String, required: false },
    usergroup: { type: String, required: false }, // 1 = Store Admin, 2 = Store User
    latitude: { type: String, required: false },
    longitude: { type: String, required: false },
    location: [],
    storeid: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: false },
    storename: { type: String, required: false },
    ispasswordreset: { type: String, reuired: false }, // 1 = Yes, //0 = No (This will be used to force user to change password on loging with temporary password)
    mobileverified: { type: Boolean, required: false },
    emailverified: { type: Boolean, required: false },
    addressverified: { type: Boolean, required: false },
    registrationdate: { type: String, required: false },
    approveddate: { type: String, required: false },
    approvedby: { type: String, required: false },
    modifiedby: { type: String, required: false },
    modifieddate: { type: String, required: false },
    mainstoreadmin: { type: Number, required: false }, //This will be set to 1 for the first time to fix this user as the main store admin. Subsequent users should be saved with 2
    maxnoofusers: { type: Number, required: false }
});

module.exports = mongoose.model('StoreUser', StoreUserSchema);