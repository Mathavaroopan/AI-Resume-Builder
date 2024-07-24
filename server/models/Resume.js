const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    themeColor: { type: String, default: '#ff6666' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    educationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Education' }],
    experienceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experience' }],
    skillsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skills' }]
});

module.exports = mongoose.model('Resume', resumeSchema);
