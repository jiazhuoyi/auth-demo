const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  _id: { type: String, default: mongoose.Types.ObjectId() },
  title: String,
  from: String,
  content: String,
  status: { type: Number, default: 0 },
  createAt: Number
  // createAt: { type: Number, default: Date.now }
});

module.exports = mongoose.model('notice', NoticeSchema);