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
    Contract.find({ mnemonic: { $in: mnemonics } }, function(err, items) {
      let savedDapps = _.pick(items.body, [
        "contractName",
        "mnemonic",
        "network",
        "createdAt",
        "_id"
      ]);
      console.log(savedDapps);
    });
  }
});
