var mongoose = require('mongoose');

var Contract = mongoose.model('Contract', {
  premium: { type: Boolean },
  viewCount: {
    type: Number
  },
  userAddressArray: {
    type: Object
  },
  contractName: {
    type: String
  },
  description: {
    type: String
  },
  mnemonic: {
    type: String
  },
  contactInfo: {
    type: Object
  },
  colorLight: {
    type: String
  },
  colorDark: {
    type: String
  },
  instructions: {
    type: String
  },
  network: {
    type: String
  },
  contractAddress: {
    type: String
  },
  creatorAddress: {
    type: String
  },
  functions: {
    type: Object
  },
  abi: {
    type: JSON
  },
  backgroundImage: {
    type: String
  },
  favicon: {
    type: String
  },
  icon: {
    type: String
  }
});

module.exports = { Contract };
