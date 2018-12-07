var mongoose = require('mongoose');

var Email = mongoose.model('Email', {
  email: {
    type: String
  }
});

module.exports = { Email };
