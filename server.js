// Dependencies
const _ = require("lodash");
const express = require("express");

// Database toolds
const bodyParser = require("body-parser");

require("./db/config"); // Database login secrets
var { mongoose } = require("./db/mongoose");
var { Contract } = require("./models/Contract");

var mnGen = require("mngen"); // Random word generator

var app = express();
app.set("port", process.env.PORT || 3001);
// Express only serves static assets in production
app.use(bodyParser.json());

app.post("/contracts", (req, res) => {
  const contractName = req.body.contractName;
  const abi = req.body.abi;
  const contractAddress = req.body.contractAddress;
  const network = req.body.network;

  // Generate the mnemonic word for the URL
  const mnemonic = mnGen.word(3);

  console.log(" ");
  console.log("################## POST #####################");
  console.log(
    `Name: ${contractName}, network: ${network}, address: ${contractAddress}`
  );
  const currentTime = Date.now();
  console.log(`Current time: ${currentTime}`);
  console.log(`URL: www.oneclickdapp.com/~${mnemonic}`);
  var contract = new Contract({
    contractName: contractName,
    abi: abi,
    contractAddress: contractAddress,
    network: network,
    mnemonic: mnemonic,
    createdAt: currentTime
  });

  contract.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get("/contracts/recentContracts", (req, res) => {
  Contract.find()
    .sort({ _id: -1 })
    .limit(10)
    .then(contractArray => {
      recentContracts = new Array();
      contractArray.forEach(contract => {
        var contractData = {
          contractName: contract.contractName,
          network: contract.network,
          mnemonic: contract.mnemonic,
          createdAt: contract._id.getTimestamp()
        };
        recentContracts.push(contractData);
      });
      res.send({
        recentContracts
      });
    })
    .catch(function(err) {
      res.status(400).send(`Recent contracts not found...`);
      console.log(err.err);
    });
});

app.get("/contracts/~:mnemonic", (req, res) => {
  var mnemonic = req.params.mnemonic.toLowerCase();
  console.log(" ");
  console.log("################## GET  #####################");
  console.log(`Retrieving contract for mnemonic: ${mnemonic}`);

  Contract.find({ mnemonic: mnemonic })
    .then(contractArray => {
      if (contractArray.length) {
        var myContract = contractArray[0];
        const contractName = myContract.contractName;
        const abi = myContract.abi;
        const contractAddress = myContract.contractAddress;
        const network = myContract.network;
        const createdAt = myContract.createdAt;
        res.send({
          contractName,
          abi,
          contractAddress,
          network,
          createdAt
        });
      } else {
        res.status(400).send(`Contract not found: ${mnemonic}`);
        return;
      }
    })
    .catch(function(err) {
      res.status(400).send(`Contract not found: ${mnemonic}`);
      console.log(err.err);
    });
});

if (process.env.NODE_ENV === "production") {
  app.set("port", 80);
  app.use(express.static("client/build"));
  app.use("*", express.static("client/build"));
}

app.listen(app.get("port"), () => {
  console.log(
    `_______________________________________________________________`
  );
  console.log(` `);
  console.log(`################# oneClickDApp API Server ####################`);
  console.log(` `);
  console.log(`Started on port ${app.get("port")}`);
  console.log(`______________________________________________________________`);
  console.log(` `);
});

//allows export app to server.test.js
module.exports = { app };
