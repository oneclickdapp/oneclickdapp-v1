var mongoose = require('mongoose');

var User = mongoose.model('User', {
  creatorAddress: {
    type: String,
    required: true
  },
  savedDapps: {
    type: Array
  }
});

module.exports = { User };
