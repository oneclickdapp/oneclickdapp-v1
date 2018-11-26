const Registry = require('eth-registry');
const Web3 = require('web3');

// Dependencies
const _ = require('lodash');
const express = require('express');
const fs = require('fs');
// Database toolds
const bodyParser = require('body-parser');

require('./db/config'); // Database login secrets
var { db } = require('./db/mongoose');
var { Contract } = require('./models/contract');
var { User } = require('./models/user');

var mnGen = require('mngen'); // Random word generator
// process.env.NODE_ENV === 'production'
var app = express();
app.set('port', process.env.PORT || 3001);
// Express only serves static assets in production
app.use(bodyParser.json());

app.post('/contracts', (req, res) => {
  const contractName = req.body.contractName;
  const abi = req.body.abi;
  const contractAddress = req.body.contractAddress;
  const network = req.body.network;
  const creatorAddress = req.body.creatorAddress.toLowerCase();
  // Generate the mnemonic word for the URL
  const mnemonic = mnGen.word(2);
  const currentTime = Date.now();

  console.log(' ');
  console.log('################## POST #####################');
  console.log(
    `Name: ${contractName}, network: ${network}, address: ${contractAddress}`
  );
  console.log(`Creator address: ${creatorAddress}`);
  console.log(`Current time: ${currentTime}`);
  console.log(`URL: www.oneclickdapp.com/${mnemonic}`);
  var contract = new Contract({
    contractName: contractName,
    abi: abi,
    contractAddress: contractAddress,
    network: network,
    mnemonic: mnemonic,
    createdAt: currentTime,
    creatorAddress
  });

  User.findOneAndUpdate(
    { creatorAddress },
    { $push: { savedDapps: mnemonic } },
    {
      upsert: true,
      new: true
    },
    function() {
      console.log('User created/updated successfully!');
    }
  );

  contract.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get('/contracts/recentContracts', (req, res) => {
  Contract.find()
    .sort({ _id: -1 })
    .limit(50)
    .then(contractArray => {
      recentContracts = new Array();
      contractArray.forEach(contract => {
        var contractData = {
          contractName: contract.contractName,
          network: contract.network,
          mnemonic: contract.mnemonic,
          createdAt: contract._id.getTimestamp(),
          creatorAddress: contract.creatorAddress
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

app.get('/contracts/externalContracts', (req, res) => {
  console.log(' ');
  console.log('################## GET  #####################');
  console.log(`Retrieving external contracts`);
  let externalContracts = [];
  const path = './externalContracts/myEtherWallet/src/contracts/eth';
  fs.readdirSync(path).forEach(file => {
    const contract = JSON.parse(fs.readFileSync(`${path}/${file}`, 'utf8'));
    contract.source = 'MEW Ethereum-lists';
    contract.title = contract.name;
    externalContracts.push(contract);
  });
  res.send({
    externalContracts
  });
});

app.get('/contracts/:mnemonic', (req, res) => {
  var mnemonic = req.params.mnemonic.toLowerCase();
  console.log(' ');
  console.log('################## GET  #####################');
  console.log(`Retrieving contract for mnemonic: ${mnemonic}`);

  Contract.find({ mnemonic: mnemonic })
    .then(contractArray => {
      if (contractArray.length) {
        var myContract = contractArray[0];
        const contractName = myContract.contractName;
        const abi = myContract.abi;
        const contractAddress = myContract.contractAddress;
        const network = myContract.network;
        const createdAt = myContract._id.getTimestamp();

        const provider = new Web3.providers.HttpProvider(
          `https://mainnet.infura.io/`
        );
        const registry = new Registry(provider);
        let metaData = {};
        registry
          .get(contractAddress)
          .then(res => {
            metaData = res;
            res.send({
              contractName,
              abi,
              contractAddress,
              network,
              createdAt,
              metaData
            });
          })
          .catch(e => {
            console.error(e);
            res.send({
              contractName,
              abi,
              contractAddress,
              network,
              createdAt,
              metaData
            });
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

app.get('/user/:creatorAddress', (req, res) => {
  var creatorAddress = req.params.creatorAddress.toLowerCase();
  console.log(' ');
  console.log('################## GET  #####################');
  console.log(`Retrieving contracts for user address: ${creatorAddress}`);

  User.findOne({ creatorAddress })
    .then(user => {
      mnemonics = user.savedDapps;
      if (mnemonics !== undefined && mnemonics.length > 0) {
        Contract.find({ mnemonic: { $in: mnemonics } })
          .sort({ _id: -1 })
          .then(dapps => {
            // createdAt: dapp._id.getTimestamp();
            res.send(dapps);
          });
      } else {
        res.status(400).send(`User not found: ${creatorAddress}`);
      }
    })
    .catch(function(err) {
      res.status(400).send(`User not found`);
      console.log(err.err);
    });
});

// Return the front-end for all other GET calls
if (process.env.NODE_ENV === 'production') {
  app.set('port', 80);
  app.use(express.static('client/build'));
  app.use('*', express.static('client/build'));
}

app.listen(app.get('port'), () => {
  console.log(
    `_______________________________________________________________`
  );
  console.log(` `);
  console.log(`################# oneClickDApp API Server ####################`);
  console.log(` `);
  console.log(`Started on port ${app.get('port')}`);
  console.log(`______________________________________________________________`);
  console.log(` `);
});

//allows export app to server.test.js
module.exports = { app };
