// Dependencies
const _ = require("lodash");
const express = require("express");

const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

var { mongoose } = require("./db/mongoose");
var { Provider } = require("./models/Provider");

var app = express();

app.set("port", process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(bodyParser.json());

app.post("/providers", (req, res) => {
  const name = req.body.name;

  console.log(" ");
  console.log("################## POST Provider  #####################");
  console.log(`Name: ${name}`);
  var provider = new Provider({
    name: name
  });

  provider.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.patch("/providers", (req, res) => {
  let action_id = req.body.action_id;
  let amount = req.body.amount;
  console.log(req.body.from);
  console.log(req.body.to);
  let fromEthAddress = req.body.from.toLowerCase();
  let toEthAddress = req.body.to.toLowerCase();
  let from;
  let to;
  // console.log(toEthAddress.toLowerCase());
  // console.log(fromEthAddress.toLowerCase());

  //Convert eth addresses into OST walletIDs
  User.find({ ethId: fromEthAddress })
    .then(userArray => {
      var user = userArray[0];
      from = user.walletId;
    })
    .catch(function(err) {
      console.log(to, from);
      console.log(err.err);
    })
    .then(
      () => {
        User.find({ ethId: toEthAddress })
          .then(userArray => {
            var user2 = userArray[0];
            to = user2.walletId;
          })
          .catch(function(err) {
            console.log(to, from);
            console.log(err.err);
          })

          .then(
            () => {
              console.log("     ");
              console.log(
                `####################### ACTION CALL ############################`
              );
              console.log(
                `Action requested: ${action_id}, with amount: ${amount}`
              );
              console.log(`Ethereum addresses: from ${fromEthAddress} `);
              console.log(`to---> ${toEthAddress}`);
              console.log(`Converted to OST wallet Id: from ${from}`);
              console.log(`to---> ${to}`);
              // "Answer" and "Vote" actions have their 'amount' property already defined
              if (action_id != end_ActionId) {
                transactionService
                  .execute({
                    action_id: action_id,
                    from_user_id: from,
                    to_user_id: to,
                    currency: "BT"
                  })
                  .then(function(response) {
                    res.status(200).send(to);
                    console.log("Success!");
                  })
                  .catch(function(err) {
                    res.status(400).send(err.err);
                    console.log(action_id, to, from);
                    console.log(err.err);
                  });
              } else {
                // find the remaining token balance of the game to clear it out.
                let balance;
                ost_balance
                  .get({ id: from })
                  .then(balanceResponse => {
                    balance = balanceResponse.data.balance.available_balance;
                  })
                  .then(
                    () => {
                      // "End Game" action requires an 'amount.' wich is the game's remaining balance
                      transactionService
                        .execute({
                          action_id: action_id,
                          to_user_id: from,
                          from_user_id: to,
                          currency: "BT",
                          amount: balance
                        })
                        .then(function(res) {
                          console.log("Success!");
                          res.status(200).send(response);
                        })
                        .catch(function(err) {
                          console.log(to, from);
                          res.status(400).send(err.err);
                          console.log(err.err);
                        });
                    },
                    e => {
                      res
                        .status(400)
                        .send(`execution endGame error: ${JSON.stringify(e)}`);
                    }
                  );
              }
            },
            e => {
              res
                .status(400)
                .send(
                  `execution vote/answer action error: ${JSON.stringify(e)}`
                );
            }
          );
      },
      e => {
        res.status(400).send(e);
      }
    );
});

app.listen(app.get("port"), () => {
  console.log(
    `_______________________________________________________________`
  );
  console.log(` `);
  console.log(`################# Innate demo API Server ####################`);
  console.log(` `);
  console.log(`Started on port ${app.get("port")}`);
  console.log(`______________________________________________________________`);
  console.log(` `);
});

//allows export app to server.test.js
module.exports = { app };
