var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.promise = global.Promise;

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
);

module.exports = { mongoose };
