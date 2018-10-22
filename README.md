# One Click DApp

Paste an ABI and get a permanent link that can be used to interact with that contract

![alt-text](https://github.com/blockchainbuddha/one-click-DApps/blob/master/screengrab.png)

## Problem

##### Users and developers need a quick and easy way to save and share their smart contracts.

The goal of this project is to make it easier to interact with smart contracts deployed to ethereum. Currently it is a pain to interact with simple contracts which were previously deployed. You can use remix or truffle, but there is no way to send a link to a friend, and have them be able to call function on the contract, unless a developer builds a whole front end themselves.

## Features Completed

- Save a DApp using custom domain ending e.g. `site.com/banana-monkey-fruit`
- See recent history of DApps created by others

## Planned

- Automatically save/show your DApp history using a MetaMask account
- In-page wallet for new ethereum users (for play only)
- DApp Emulator- simulate any mainnet DApp using Ganache forking
- IPFS for frontend and backend
- Use a decentralized domain name service provider
- "Copy the code" button to quickly build an input form for your own React app.

## Run the app

1.  Run `npm install` in both root directory, and in `/client`
2.  Create `config.js` in `/db` and enter your mongoDB URL
    > process.env.MONGODB_URI = "mongodb://..."
3.  cd to root directory and run `npm start`

## Run in production mode

First enable node to listen on port 80

1.  `sudo apt-get install libcap2-bin`
2.  `sudo setcap cap_net_bind_service=+ep /usr/local/bin/node`

Then `npm run start-production`

## Contact

[Joseph](https://twitter.com/cupojoseph),
[Patrick](https://twitter.com/pi0neerpat)
