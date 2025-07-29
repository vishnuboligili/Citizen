const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helped: {
    type: Number,
    default: 0
  },
  fake: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: "user"
  },
  region: {
    type: String,
    default: null
  },
  pincode: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  isAssigned: {
    type: Boolean,
    default: false
  },
  workerType: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Users', userSchema);
