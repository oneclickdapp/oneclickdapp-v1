import contract from './contracts/splitter/splitter';
var solc = require('solc');

function compile(contract) {
  console.log('input is a smart contract');
  var output = solc.compile(contract);
  console.log(JSON.stringify(output));
  output.contracts['splitter'].interface;
}

compile(contract);
