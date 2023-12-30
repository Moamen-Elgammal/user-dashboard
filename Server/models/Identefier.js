const mongoose = require('mongoose');

const Indentefier = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  hobbies: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('usersInfo', Indentefier);
