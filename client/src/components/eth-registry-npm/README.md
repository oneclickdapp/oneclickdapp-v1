# Eth Registry

[![Greenkeeper badge](https://badges.greenkeeper.io/ethtective/cafe.svg)](https://greenkeeper.io/) [![Build
Status](https://travis-ci.com/Cygnusfear/theregistry.npm.svg?token=J95RxJssBScLdG1sc76e&branch=master)](https://travis-ci.com/ethtective/cafe)
[![code style:
prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Ethereum Dapp
Badge](https://img.shields.io/badge/web3-app-00ffd9.svg?longcache=true&logo=Ethereum&logoColor=white&style=flat&logoWidth=12)](http://www.ethereum.org)

A Node.js module to easily retrieve address metadata from Eth Registry's Ethereum contract.

https://ethregistry.org

# Setup

Usage:

`yarn add theregistry`

# API

## Functions

<dl>
<dt><a href="#get">get(_address)</a> ⇒ <code>string</code> | <code>string</code></dt>
<dd><p>Retrieve metadata for this address</p>
</dd>
<dt><a href="#storeMetadata">storeMetadata(_address, _name, _data, _callback)</a> ⇒ <code>string</code></dt>
<dd><p>Stores address metadata on Eth Registry</p>
</dd>
<dt><a href="#storeJsonFileIPFS">storeJsonFileIPFS(Blob)</a> ⇒ <code>string</code></dt>
<dd><p>Reads content of a JSON file and stores it on IPFS</p>
</dd>
<dt><a href="#storeDataFileIPFS">storeDataFileIPFS(Blob)</a> ⇒ <code>string</code></dt>
<dd><p>Reads content of a Plaintext file and stores it on IPFS</p>
</dd>
<dt><a href="#convertBlobToBase64">convertBlobToBase64(Blob)</a> ⇒ <code>string</code></dt>
<dd><p>Converts an image blob to a base64 string</p>
</dd>
<dt><a href="#lookUp">lookUp(IPFS)</a> ⇒ <code>string</code></dt>
<dd><p>Reads content of a JSON file and stores it on IPFS</p>
</dd>
<dt><a href="#price">price(unit)</a> ⇒ <code>number</code></dt>
<dd><p>Retrieve the current price for submitting data to Eth Registry</p>
</dd>
<dt><a href="#getHistory">getHistory()</a> ⇒ <code>string</code></dt>
<dd><p>Retrieve the last 10 submissions to Eth Registry</p>
</dd>
</dl>

<a name="get"></a>

## get(_address) ⇒ <code>string</code> \| <code>string</code>
Retrieve metadata for this address

**Kind**: global function  
**Returns**: <code>string</code> - Address Metadata object with received metadata or null when no metadata available<code>string</code> - Name Metadata object with received metadata or null when no metadata available  

| Param | Type |
| --- | --- |
| _address | <code>string</code> | 

**Example**  
```js
import Registry from "eth-registry";
import Web3 from "web3";

const provider = new Web3.providers.HttpProvider(
  `https://mainnet.infura.io/`,
);

const registry = new Registry(provider);
registry
  .get(ensaddress)
  .then(r => {
      console.log(r.data);
  })
  .catch(e => console.error(e));

```
<a name="storeMetadata"></a>

## storeMetadata(_address, _name, _data, _callback) ⇒ <code>string</code>
Stores address metadata on Eth Registry

**Kind**: global function  
**Returns**: <code>string</code> - TX Hash of the submitted file  

| Param | Type | Description |
| --- | --- | --- |
| _address | <code>string</code> | Address for which you are submitting data |
| _name | <code>string</code> | Name of the address |
| _data | <code>string</code> | Metadata object |
| _callback | <code>function</code> | Callback for when the transaction receipt is returned |

<a name="storeJsonFileIPFS"></a>

## storeJsonFileIPFS(Blob) ⇒ <code>string</code>
Reads content of a JSON file and stores it on IPFS

**Kind**: global function  
**Returns**: <code>string</code> - IPFS Hash of stored file  

| Param | Type | Description |
| --- | --- | --- |
| Blob | <code>blob</code> | accepted by Filereader |

<a name="storeDataFileIPFS"></a>

## storeDataFileIPFS(Blob) ⇒ <code>string</code>
Reads content of a Plaintext file and stores it on IPFS

**Kind**: global function  
**Returns**: <code>string</code> - IPFS Hash of stored file  

| Param | Type | Description |
| --- | --- | --- |
| Blob | <code>blob</code> | accepted by Filereader |

<a name="convertBlobToBase64"></a>

## convertBlobToBase64(Blob) ⇒ <code>string</code>
Converts an image blob to a base64 string

**Kind**: global function  
**Returns**: <code>string</code> - base64 encoded image file  

| Param | Type | Description |
| --- | --- | --- |
| Blob | <code>blob</code> | accepted by Filereader |

<a name="lookUp"></a>

## lookUp(IPFS) ⇒ <code>string</code>
Reads content of a JSON file and stores it on IPFS

**Kind**: global function  
**Returns**: <code>string</code> - JSON contents returned from IPFS  

| Param | Type | Description |
| --- | --- | --- |
| IPFS | <code>string</code> | address to look up |

<a name="price"></a>

## price(unit) ⇒ <code>number</code>
Retrieve the current price for submitting data to Eth Registry

**Kind**: global function  
**Returns**: <code>number</code> - Current price  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| unit | <code>string</code> | <code>&quot;ether&quot;</code> | Unit to convert the price to (defaults to 'ether') |

<a name="getHistory"></a>

## getHistory() ⇒ <code>string</code>
Retrieve the last 10 submissions to Eth Registry

**Kind**: global function  
**Returns**: <code>string</code> - the last 10 submissions to Eth Registry  

# Development

- `npm run clean` - Remove `lib/` directory
- `npm test` - Run tests with linting and coverage results.
- `npm test:only` - Run tests without linting or coverage.
- `npm test:watch` - You can even re-run tests on file changes!
- `npm test:prod` - Run tests with minified code.
- `npm run test:examples` - Test written examples on pure JS for better understanding module usage.
- `npm run lint` - Run ESlint with airbnb-config
- `npm run cover` - Get coverage report for your code.
- `npm run build` - Babel will transpile ES6 => ES5 and minify the code.
- `npm run prepublish` - Hook for npm. Do all the checks before publishing your module.

# License

MIT © Alexander Mangel