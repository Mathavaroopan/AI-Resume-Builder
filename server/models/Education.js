const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    universityName: String,
    startDate: String,
    endDate: String,
    degree: String,
    major: String,
    description: String
});

module.exports = mongoose.model('Education', educationSchema);
