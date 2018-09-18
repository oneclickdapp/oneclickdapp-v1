// client-side js
// run by the browser each time your view template referencing it is loaded
import {
  FIELD_TYPES,
  canRenderMethodParams,
  renderMethodParams,
  canRenderMethodOutputs,
  renderMethodOutputs
} from 'ethereum-abi-ui'

console.log('hello world :o');

// define variables that reference elements on our page
const ABI = [ /* Solidity contract ABI definition */ ]
const form = $('method')
const output = $('outputs')

const fields = []

function submit() {
  const values = {}

  fields.forEach(input => {
    // sanitize entered value
    const val = input.instance.sanitize(input.val())

    // check that it's valid
    if (!input.instance.isValid(val)) {
      throw new Error('Please enter valid data')
    }

    // add to final values to send
    values[input.getAttribute('name')] = val
  })

  const results = doWeb3MethodCallUsingFormFieldValues(values)

  // now render the results
  if (canRenderMethodOutputs(ABI, 'approve')) {
    renderMethodOutputs(ABI, 'approve', results, (name, index, instance, result) => {
      output.append(`<p>${name}: ${result}</p>`)
    })
  }
}

