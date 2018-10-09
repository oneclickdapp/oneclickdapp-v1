# One Click DApp

Paste an ABI and get a permanent link that can be used to interact with that contract

![alt-text](https://github.com/blockchainbuddha/one-click-DApps/blob/react/screengrab.png)

## Problem

##### Users and developers need a quick and easy way to save and share their smart contracts.

The goal of this project is to make it easier to interact with smart contracts deployed to ethereum. Currently it is a pain to interact with simple contracts which were previously deployed. You can use remix or truffle, but there is no way to send a link to a friend, and have them be able to call function on the contract, unless a developer builds a whole front end themselves.

## Features Completed

- Save a DApp using custom domain ending e.g. `site.com/banana-monkey-fruit`

## Planned

- Automatically save/show your DApp history using a MetaMask account
- "Copy the code" button to quickly build an input form for your own React app.
- In-page wallet for users without a wallet (for testing only)
- DApp Emulator- simulate any DApp using a mainnet fork.

## Run the app

1.  Run `npm install` in both root directory, and in `/client`
2.  Create `config.js` in `/db` and enter your mongoDB URL
    > process.env.MONGODB_URI = "mongodb://..."
3.  cd to root directory and run `npm start`

## Contact

[Joseph](https://twitter.com/cupojoseph)
[Patrick](https://twitter.com/pi0neerpat)
