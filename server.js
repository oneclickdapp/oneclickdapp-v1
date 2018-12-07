const Registry = require('eth-registry');
const Web3 = require('web3');
const _ = require('lodash');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
require('./db/config'); // Database login secrets
var { db } = require('./db/mongoose');
var { Contract } = require('./models/contract');
var { User } = require('./models/user');
var { Email } = require('./models/email');
var mnGen = require('mngen'); // Random word generator

var app = express();
app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());

app.post('/contracts', (req, res) => {
  const contractName = req.body.contractName;
  const abi = req.body.abi;
  const contractAddress = req.body.contractAddress;
  const network = req.body.network;
  let creatorAddress = 'creatorAddress not provided';
  if (req.body.creatorAddress) {
    creatorAddress = req.body.creatorAddress.toLowerCase();
  }
  // Generate the mnemonic word for the URL
  const mnemonic = mnGen.word(2);

  console.log(' ');
  console.log('################## POST #####################');
  console.log(
    `Name: ${contractName}, network: ${network}, address: ${contractAddress}`
  );
  console.log(`Creator address: ${creatorAddress}`);
  console.log(`URL: www.oneclickdapp.com/${mnemonic}`);
  var contract = new Contract({
    contractName: contractName,
    abi: abi,
    contractAddress: contractAddress,
    network: network,
    mnemonic: mnemonic,
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
app.post('/emails', (req, res) => {
  const email = req.body.email;
  console.log(' ');
  console.log('################## POST #####################');
  console.log(`Email: ${email}`);

  Email.findOneAndUpdate(
    { email },
    { $set: { email } },
    {
      upsert: true,
      new: true
    },
    function() {
      console.log('Email recorded successfully!');
    }
  );
});
app.post('/transaction', (req, res) => {
  const hash = req.body.hash;
  const network = req.body.network;
  const value = req.body.value;
  const mnemonic = req.body.mnemonic;
  if (req.body.userAddress) {
    userAddress = req.body.userAddress.toLowerCase();
  }
  console.log(' ');
  console.log('################## POST #####################');
  console.log(
    `${value} ETH transaction on ${network} http://oneclickdapp.com/${mnemonic}`
  );
  console.log(`tx hash: ${tx}`);

  Transaction.findOneAndUpdate(
    { hash: hash },
    { $set: { hash, network, value, mnemonic, userAddress } },
    {
      upsert: true,
      new: true
    },
    function() {
      console.log('Transaction recorded.');
    }
  );
  User.findOneAndUpdate(
    { creatorAddress: userAddress },
    { $push: { transactions: hash } },
    {
      upsert: true,
      new: true
    },
    function() {
      console.log('User transactions data updated.');
    }
  );
});
app.get('/contracts/recentContracts', (req, res) => {
  console.log(' ');
  console.log('################## GET  #####################');
  console.log(`Fetching recent contracts`);
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
      res.status(404).send(`Recent contracts not found...`);
      console.log(err.err);
    });
});
app.get('/contracts/externalContracts', (req, res) => {
  console.log(' ');
  console.log('################## GET  #####################');
  console.log(`Fetching external contracts`);
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
  try {
    var mnemonic = req.params.mnemonic.toLowerCase();
    let userAddress = '0x';
    if (req.body.userAddress) {
      userAddress = req.body.userAddress.toLowerCase();
    }
    console.log(' ');
    console.log('################## GET  #####################');
    console.log(`Fetching contract for mnemonic: ${mnemonic}`);

    Contract.findOneAndUpdate(
      { mnemonic },
      { $inc: { viewCount: 1 }, $push: { userAddressArray: userAddress } },
      (err, contract) => {
        if (contract !== null) {
          const provider = new Web3.providers.HttpProvider(
            `https://mainnet.infura.io/`
          );
          const registry = new Registry(provider);
          let metaData = {};
          registry
            .get(contract.contractAddress)
            .then(metaData => {
              res.send({
                premium: contract.premium || false,
                contractName: contract.contractName,
                description: contract.description || '',
                mnemonic: contract.mnemonic,
                contactInfo: contract.contactInfo || '',
                colorLight: contract.colorLight || '',
                colorDark: contract.colorDark || '',
                instructions: contract.instructions || '',
                network: contract.network || '',
                contractAddress: contract.contractAddress || '',
                creatorAddress: contract.creatorAddress || '',
                metaData: metaData || '',
                functions: contract.functions || '',
                abi: contract.abi || '',
                backgroundImage: contract.backgroundImage || '',
                favicon: contract.favicon || '',
                icon: contract.icon || '',
                createdAt: contract._id.getTimestamp()
              });
            })
            .catch(e => {
              console.error('Metadata not accessible');
              res.send({
                premium: contract.premium || false,
                contractName: contract.contractName,
                description: contract.description || '',
                mnemonic: contract.mnemonic,
                contactInfo: contract.contactInfo || '',
                colorLight: contract.colorLight || '',
                colorDark: contract.colorDark || '',
                instructions: contract.instructions || '',
                network: contract.network || '',
                contractAddress: contract.contractAddress || '',
                creatorAddress: contract.creatorAddress || '',
                metaData: '',
                functions: contract.functions || '',
                abi: contract.abi || '',
                backgroundImage: contract.backgroundImage || '',
                favicon: contract.favicon || '',
                icon: contract.icon || '',
                createdAt: contract._id.getTimestamp()
              });
            });
        } else {
          console.log(`No contract found`);
          res.status(404).send(`Contract not found: ${mnemonic}`);
        }
      }
    ).catch(function(err) {
      console.log(`Contract not found` + err);
      res.status(404).send(`Contract not found: ${mnemonic}`);
    });
  } catch (err) {
    console.log(`Contract not found` + err);
    res.status(404).send(`Contract not found: ${mnemonic}`);
  }
});
app.get('/user/:creatorAddress', (req, res) => {
  var creatorAddress = req.params.creatorAddress.toLowerCase();
  console.log(' ');
  console.log('################## GET  #####################');
  console.log(`Fetching user saved contracts: ${creatorAddress}`);
  try {
    User.findOneAndUpdate(
      { creatorAddress },
      { $set: { creatorAddress } },
      {
        upsert: true,
        new: true
      },
      (err, user) => {
        if (err) console.log(err);
        else if (user.savedDapps !== undefined && user.savedDapps.length > 0) {
          mnemonics = user.savedDapps;
          Contract.find({ mnemonic: { $in: mnemonics } })
            .sort({ _id: -1 })
            .then(dapps => {
              res.send(dapps);
            });
        } else {
          res.status(404).send(`No user saved dApps found  ${creatorAddress}`);
          console.log('No user saved dApps found');
        }
      }
    );
  } catch (err) {
    res.status(404).send(`User not found ` + creatorAddress);
    console.log('No user saved dApps found');
  }
});

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
module.exports = { app };
