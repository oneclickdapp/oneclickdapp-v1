import React, { Component } from "react";
import "./App.css";
import {
  // Grid,
  // List,
  Button,
  // Table,
  // Input,
  // Message,
  Form
  // Card,
  // Divider,
  // Segment,
  // Header,
  // Icon,
  // Label
} from "semantic-ui-react";
import {
  FIELD_TYPES,
  canRenderMethodParams,
  renderMethodParams,
  canRenderMethodOutputs,
  renderMethodOutputs
} from "ethereum-abi-ui";

class App extends Component {
  state = { abi: "" };

  submitABI = () => {
    console.log("Creating DApp...");

    //not sure what these are for
    let form;

    const fields = [];

    if (canRenderMethodParams(this.state.abi, "approve")) {
      console.log("canRenderMethodParams");
      renderMethodParams(this.state.abi, "approve", (name, instance) => {
        switch (instance.fieldType()) {
          case FIELD_TYPES.NUMBER: {
            console.log(name);
            // const input = $(`<input type="number" name="${name}" />`);
            // input.instance = instance;
            // fields.push(input);
            // form.append(input);
            break;
          }
          case FIELD_TYPES.ADDRESS:
            // ...
            break;
          // ...
        }
      });
    } else {
      console.log("incorrect ABI format");
    }

    // const values = {};
    // console.log(JSON.stringify(fields));
    // fields.forEach(input => {
    //   // sanitize entered value
    //   const val = input.instance.sanitize(input.val());
    //
    //   // check that it's valid
    //   if (!input.instance.isValid(val)) {
    //     throw new Error("Please enter valid data");
    //   }
    //
    //   // add to final values to send
    //   values[input.getAttribute("name")] = val;
    // });

    // const results = doWeb3MethodCallUsingFormFieldValues(values);

    // now render the results
    // if (canRenderMethodOutputs(ABI, "approve")) {
    //   renderMethodOutputs(
    //     ABI,
    //     "approve",
    //     results,
    //     (name, index, instance, result) => {
    //       output.append(`<p>${name}: ${result}</p>`);
    //     }
    //   );
    // }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Title name</h1>
        </header>
        <Form>
          <Form.TextArea label="Contract ABI" placeholder="ABI" />
          <Form.Button onClick={this.submitABI} content="DApp it up!" />
        </Form>
      </div>
    );
  }
}

export default App;
