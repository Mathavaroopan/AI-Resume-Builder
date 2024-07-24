const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
    name: String,
    rating: Number
});

module.exports = mongoose.model('Skills', skillsSchema);
