# One Click dApp

Smart contract dApps are just one click away.

![alt-text](https://github.com/blockchainbuddha/one-click-dApps/tree/master/readme-assets/dapp.png)

## Problem

You made a smart contract...now what?

**There is no easy way to share a smart contract interface!**

The goal of this project is to make it easier to interact with smart contracts. OneClickDapp instantly builds you a dApp with a simple URL to bookmark or share with a friend. Anyone with the dApp URL can interact with _your shiny new smart contract_, and access all functions at the correct address/network. Don't write a single line of front-end code. Forget about verifying your contract on Etherscan or MEW. Your dApp is just one click away!

![alt-text](https://github.com/blockchainbuddha/one-click-dApps/tree/master/readme-assets/instructions.png)

### Head to [OneClickdApp.com](oneclickdapp.com) to make your own dApp now.

## Features Completed

:white_check_mark: Custom dApp URL e.g. `site.com/stone-tablet`

:white_check_mark: Recent public history of dApps

:white_check_mark: Auto-save your dApps using wallet address

:white_check_mark: Clone an existing dApp (sources available: [MEW ethereum-lists](https://github.com/MyEtherWallet/ethereum-lists))

:white_check_mark: In-page wallet for new ethereum users

:white_check_mark: Twitter share Button

:white_check_mark: Medieval stone-sculpting theme

![alt-text](https://github.com/blockchainbuddha/one-click-dApps/tree/master/readme-assets/chisel-process.png)

## Planned

- Ganache forking to emulate any mainnet dApp
- IPFS for saving dApps
- Custom ENS domain names
- "Copy the code" button to build your own React app.
- Display Events and Transactions using Dapparatus

## Run the app locally

1.  Run `npm install` in both root directory, and in `/client`
2.  Create `config.js` in `./db/` and enter your mongoDB URL
    > process.env.MONGODB_URI = "mongodb://..."
3.  cd to root directory and run `npm start`

## Contributions welcome!

This tool is primarily maintained by a single person. It is self-funded and free to use.

Please consider helping by submitting an issue or PR if you want to see improvements faster.

## Contact

[Patrick](https://twitter.com/pi0neerpat),
[Joseph](https://twitter.com/cupojoseph)
