// Dependencies
const _ = require("lodash");
const express = require("express");

const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

require("./db/config");
var { mongoose } = require("./db/mongoose");
var { Provider } = require("./models/Contract");

var app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(bodyParser.json());

app.post("/contracts", (req, res) => {
  const name = req.body.name;
  const abi = req.body.abi;
  const address = req.body.address;
  const network = req.body.network;

  console.log(" ");
  console.log("################## POST Contract  #####################");
  console.log(`Name: ${name}, network: ${network}, address: ${address}`);
  var contract = new Contract({
    name: name,
    abi: abi,
    address: address,
    network: network
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

app.patch("/contracts", (req, res) => {
  // do something
});

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
