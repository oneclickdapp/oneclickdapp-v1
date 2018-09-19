import {
  FIELD_TYPES,
  canRenderMethodParams,
  renderMethodParams,
  canRenderMethodOutputs,
  renderMethodOutputs
} from 'ethereum-abi-ui'

var getInterface = (abi) => {
  if (canRenderMethodParams(ABI, 'approve')) {
  renderMethodParams(ABI, 'approve', (name, instance) => {
    switch (instance.fieldType()) {
      case FIELD_TYPES.NUMBER: {
        const input = $(`<input type="number" name="${name}" />`)
        input.instance = instance
        fields.push(input)
        form.append(input)
        break
      }
      case FIELD_TYPES.ADDRESS:
        // ...
        break
      // ...
    }
  })
}
form.submit(() => {
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


module.exports.getInterface = getInterface;
