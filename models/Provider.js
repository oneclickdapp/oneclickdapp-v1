var mongoose = require("mongoose");

var Provider = mongoose.model("Provider", {
  name: {
    type: String,
    required: true
  },
  govId: {
    type: String,
    required: false
  },
  college: {
    type: Boolean,
    required: false,
    default: false
  },
  credHospital: {
    type: Boolean,
    required: false,
    default: false
  },
  prevHospital: {
    type: Boolean,
    required: false,
    default: false
  },
  nursingBoard: {
    type: Boolean,
    required: false,
    default: false
  }
});

module.exports = { Provider };
