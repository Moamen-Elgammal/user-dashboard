const mongoose = require('mongoose');

const GoogleLogin = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('userGoogle', GoogleLogin);
