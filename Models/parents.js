
const mongoose = require('mongoose');

const parents = new mongoose.Schema({
    "empId": { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    "firstName": { type: String, required: true },
    "lastName": { type: String },
    "age": { type: Number, required: true },
    "phoneNo": { type: Number, required: true }
})

module.exports = mongoose.model('parents', parents);
