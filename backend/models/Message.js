const mongoose = require('mongoose');
const { socket } = require('../../frontend/src/context/appContext');

const messageSchema = new mongoose.Schema({
  content: String,
  from: String,
  to: String,
  socketId: String,
  date: String,
});

module.exports = mongoose.model('Message', messageSchema);