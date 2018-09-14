var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
    userId: { type: String, unique: true, },
    accessToken: { type: String},
    accessAt: { type: Number, default: Date.now },
    refreshToken: { type: String },
    refreshAt: { type: Number, default: Date.now }
});

module.exports = mongoose.model('token', TokenSchema);