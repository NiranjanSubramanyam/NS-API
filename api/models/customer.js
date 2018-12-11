const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true, unique: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    password: { type: String, required: true },
    mobile: { type: Number, required: true },
    username: { type: String, required: true },
    createddate: { type: String, required: false },
    savedfilename: { type: String, required: false }
});

module.exports = mongoose.model('Customer', customerSchema);