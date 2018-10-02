var mongoose = require("mongoose");
var config = require("./config");
//instantiate mongoose once in server.js
mongoose.promise = global.Promise;
//mongoose takes care of the order of function calls to ensure we have connection
// before the function goes
console.log("config: " +JSON.stringify(config));
//process.env.MONGODB_URI
mongoose.connect(config.mongo_url);

module.exports = { mongoose };
