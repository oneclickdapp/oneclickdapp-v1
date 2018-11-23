/* eslint-disable no-console */
const Registry = require("../lib");
const network = "mainnet";

const provider = new Eth.HttpProvider(
    `https://${network}.infura.io/v3/${process.env.INFURA_API}`,
);

const registry = new Registry(provider);

console.log(registry);
