var mongoose = require('mongoose');

var Transaction = mongoose.model('Transaction', {
  userAddress: {
    type: String
  },
  mnemonic: {
    type: String
  },
  network: {
    type: String
  },
  value: {
    type: String
  },
  hash: {
    type: String
  }
});

module.exports = { Transaction };
