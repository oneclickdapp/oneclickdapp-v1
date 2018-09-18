

const abiForm = document.forms[0];
const abiInput = abiForm.elements['abi'];

// listen for the form to be submitted and set the new ABI
abiForm.onsubmit = function(event) {
  event.preventDefault();
  console.log("ABI submitted");
  document.getElementById("abi").innerHTML = abiInput.value;
  
  //do stuff using ethereum-abi-ui
  
  
  // reset form 
  abiInput.value = '';
  abiInput.focus();
};

// let ABI = [ ]
  // {



// function submit() {
//   const values = {}

//   fields.forEach(input => {
//     // sanitize entered value
//     const val = input.instance.sanitize(input.val())

//     // check that it's valid
//     if (!input.instance.isValid(val)) {
//       throw new Error('Please enter valid data')
//     }

//     // add to final values to send
//     values[input.getAttribute('name')] = val
//   })

//   		var contractspec = web3.eth.contract(ABI);
//     contract = new web3.eth.Contract(JSON.parse(compiledGame.interface),contractAddress);
  
//   const results = contract.methods.register("Bob").send({
//     value: web3.utils.toWei("1", "ether"),
//     from: accounts[0],
//     gas: 3000000
//   });

//   // now render the results
//   if (canRenderMethodOutputs(ABI, 'approve')) {
//     renderMethodOutputs(ABI, 'approve', results, (name, index, instance, result) => {
//       output.append(`<p>${name}: ${result}</p>`)
//     })
//   }
// }

