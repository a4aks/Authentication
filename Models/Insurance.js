
const mongoose = require('mongoose');

const insurance = new mongoose.Schema({
    insuranceName: { type: String },
    empId: { type: mongoose.Types.ObjectId, ref: 'user' }


})

module.exports = mongoose.model('insurance', insurance);

