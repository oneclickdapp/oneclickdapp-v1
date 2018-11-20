var mongoose = require('mongoose');

var Contract = mongoose.model('Contract', {
  contractName: {
    type: String
  },
  abi: {
    type: JSON
  },
  contractAddress: {
    type: String
  },
  network: {
    type: String
  },
  mnemonic: {
    type: String
  },
  creatorAddress: {
    type: String
  }
});

module.exports = { Contract };
