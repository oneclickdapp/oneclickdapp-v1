# One Click Dapp

Paste an ABI and get a permanent link that can be used to interact with that contract

![alt-text](https://github.com/blockchainbuddha/one-click-DApps/blob/react/screengrab.png)

## Goal

The goal of this project is to make it easier to interact with smart contracts deployed to ethereum. Currently it is a pain to interact with simple contracts a developer has deployed. They can use remix or truffle, but there is no way to send a link to a friend and have them be able to call function on the contract, unless a developer builds a whole front end themselves.

## Features

## Planned

- accounts to save your own pastes and links
- custom domain endings

## Run the app

1. Run `npm install` in both root directory, and in `/client`
2. Create `config.js` in `/db` and enter your mongoDB URL
>var config = {
  MONGO_URL:
  "your_URL"
};
3. cd to root directory and run `npm start`

## Contact

[Joseph](https://twitter.com/cupojoseph)
[Patrick](https://twitter.com/pi0neerpat)
