const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    title: String,
    companyName: String,
    city: String,
    state: String,
    startDate: String,
    endDate: String,
    workSummery: String
});

module.exports = mongoose.model('Experience', experienceSchema);
