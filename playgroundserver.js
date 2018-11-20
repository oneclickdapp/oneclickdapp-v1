require("./db/config");
var { db } = require("./db/mongoose");
var { Contract } = require("./models/contract");
var { User } = require("./models/user");
const _ = require("lodash");

var walletAddress = "abc";

User.findOne({ walletAddress }).then(user => {
  mnemonics = user.savedDapps;
  console.log(mnemonics);
  if (mnemonics !== undefined && mnemonics.length > 0) {
    Contract.find({ mnemonic: { $in: mnemonics } })
      .sort({ _id: -1 })
      .then(dapps => {
        // createdAt: dapp._id.getTimestamp();
        console.log(dapps);
      });
  }
});
