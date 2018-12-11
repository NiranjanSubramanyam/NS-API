const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    password: { type: String, required: false },
    mobile: { type: Number, required: true },
    username: { type: String, required: true },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    businessname: { type: String, required: false }, //Save "Store Name" in this field
    businessaddress: { type: String, required: false },
    status: { type: String, required: false },
    usergroup: { type: String, required: false },
    newuser: { type: Number, required: false }, // 1 = New User, 2 = Profile Updated by User, 3 = Password reset by Admin
    storeid: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: false },
    kitchenid: { type: mongoose.Schema.Types.ObjectId, ref: 'Kitchen', required: false }
});

module.exports = mongoose.model('User', userSchema);