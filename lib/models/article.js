const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  _id: { type: String, default: mongoose.Types.ObjectId() },
  title: String,
  content: String,
  account: String,
  status: { type: Number, default: 0 },
  createAt: { type: Number, default: Date.now }
});

module.exports = mongoose.model('article', ArticleSchema);