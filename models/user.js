var mongoose = require('mongoose');

var User = mongoose.model('User', {
  creatorAddress: {
    type: String
  },
  savedDapps: {
    type: Array
  }
});

module.exports = { User };
