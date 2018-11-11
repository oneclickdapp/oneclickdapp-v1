<img alt="title-graphic" src="readme-resources/title-graphic.png" align="middle" width="800" >

# Creating a new <img alt="clamp" src="readme-resources/clamp.png" align="middle" width="40">**️Clevis**  project:

## Install <img alt="clamp" src="readme-resources/clamp.png" align="middle" width="25">levis

1. Clone a local copy of Clevis
```
git clone https://github.com/austintgriffith/clevis
cd clevis
npm install
sudo npm link ```
2. Navigate to a new project folder, then
```
clevis init```
(You may have to enter root password during this process.)
3. Check your web3 version, and be sure you are using the correct documentation for web3 ([learn more](https://github.com/blockchainbuddha/Intro-to-Blockchain#using-web3))
```
clevis version```

4. Test out a command.
```
clevis sha3 "Hello World"```
You should see:
`>>> SHA3
0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba`

Great job!

## Set up a local <img alt="ethereum" src="readme-resources/eth.png" align="middle" width="25"> Ethereum network

 Instead of developing on the main Ethereum network, or a test-network, we will install Ganache <img alt="ganche" src="readme-resources/ganache.png" align="middle" width="35"> to run a local instance, as well as a JavaScript test framework tool called mocha <img alt="mocha" src="readme-resources/mocha.png" align="middle" width="35">.

```
npm install -g ganache-cli mocha```

> Who likes waiting? Ganache allows us to process transactions instantly! Check out the full suite of [Truffle](https://truffleframework.com/)  developer tools.

6. In a **new terminal** run `ganache-cli` which starts a local instance of the Ethereum Virtual Machine (EVM). You should see:
`Listening on 127.0.0.1:8545`

Ganache-CLI also creates a new <img alt="wallet" src="readme-resources/wallet.png" align="middle" width="35"> wallet with multiple ethereum "accounts" (0xab23f...) and each are funded with 100 ETH. If you get stuck using Ganache-CLI [read the docs](https://github.com/trufflesuite/ganache-cli/blob/master/README.md).

> *Go forth and make mistakes*! Ganache-CLI is merely an instanceof the EVM, and is *only running on your machine*.

Here's how our set-up looks so far.

<img alt="clevis-explainer" src="readme-resources/clevis-explainer" align="middle" width="500">

Lets test it out by running `clevis accounts` which prints your accounts from ganache.

`['0xf2A0DD5999c23f53fE8819CBbc06d2e2B05b9093',
  '0x25a62dE56EF4fe5882336b05AbF202d1375272dD',
  '0x367347648F02A6c6e0f5126185652332e91f2d00',
  '0x5aB26450D93Bd70c66CD575e47B4c72E91df876B',...`

### send [amount] [fromindex] [toindex]

```
clevis send 0.1 0 1
```

Excellent work so far. We are ready to create a smart contract in Solidity


## Create a contract



### ignore beyond this section! (uncompiled notes)
Start a new DAPPARATUS PROJECT

docker run -ti --rm --name clevis -p 3000:3000 -p 8545:8545 \
  -v ~/test-app:/dapp austingriffith/clevis

note: React-app, Ganache, open Zeppelin, and more contracts are included. npm install is also performed.

Check localhost:3000
Point metamask to :8545 where ganache is running

Try some clevis commands
`clevis accounts`

? clevis test version- getting   

`#version()
ERROR: No Mnemonic Generated. Run 'clevis new' to create a local account.
1`

Get metamask funded with one line
edit line 146 of test/celvis.js with your metamask address
clevis test metamask

to enable relay metaTx
import Dapparatus from 'dapparatus'

const WEB3_PROVIDER = 'http://0.0.0.0:8545'

When moving to production:
ensure WEB3 PROVIDER is set to your node (e.g. infura, self-hosted)

Making a new contract is confusing
clevis compile <contract>
clevis deploy <contract> <from account>
clevis test publish ??? (verb should come first?)
** After creating the proxy contract- there should be this list of commands again^
clevis test full does all of this ^

Relayer must be restarted every time you redeploy/publish using `clevis test full` your contracts
To use relayer- must have port 9999 exposed
docker run -ti --rm --name clevis -p 3000:3000 -p 8545:8545 -p 9999:9999 -v ~/nonce-upon-a-time:/dapp austingriffith/clevis:latest
run `clevis test full` to compile/deploy/publish all contracts
run `node relayer.js` to start the relayer

Ensure <Dapparatus> points to your relayer by including the tag `metatx={METATX}` where ```METATX = {
  endpoint: 'http://0.0.0.0:9999/',
  contract: require('./contracts/Proxy.address.js')
};```
Ensure <ContractLoader> includes your proxy contract `this.setState({ contracts: contracts, metaContract:contracts.Proxy }`
Wire up Transactions to include the metaTx component as well (Show code snippet)
