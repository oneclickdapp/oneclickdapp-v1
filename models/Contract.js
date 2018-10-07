var mongoose = require("mongoose");

var Contract = mongoose.model("Contract", {
  name: {
    type: String
  },
  abi: {
    type: JSON
  },
  address: {
    type: String
  },
  network: {
    type: String
  }
});

module.exports = { Contract };
