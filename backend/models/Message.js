const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  from: String,
  to: String,
  socketId: String,
  date: String,
  time: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);