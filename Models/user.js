
const mongoose = require('mongoose');

const user = new mongoose.Schema({
    "firstName": { type: String, required: true },
    "lastName": { type: String },
    "age": { type: Number, required: true },
    "phoneNo": { type: Number, required: true },
    "gender": { type: String, required: true },
    "id": { type: String, required: true },
    "email": { type: String, required: true },
    "password": { type: String, required: true },
    "parentsId": [{ type: mongoose.Types.ObjectId, ref: "parents" }]
});

module.exports = mongoose.model('user', user);