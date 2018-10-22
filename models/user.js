var mongoose = require("mongoose");

var User = mongoose.model("User", {
  walletAddress: {
    type: String,
    required: true
  },
  savedDapps: {
    type: Array
  }
});

module.exports = { User };
