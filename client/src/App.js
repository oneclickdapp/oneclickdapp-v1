import React, { Component } from "react";
import "./App.css";
import {
  // Grid,
  // List,
  Button,
  // Table,
  // Input,
  // Message,
  Form,
  // Card,
  // Divider,
  // Segment,
  Header
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
  state = {
    abiFormatted: "",
    input: `[
  	{
  		"constant": false,
  		"inputs": [],
  		"name": "distributeFunds",
  		"outputs": [
  			{
  				"name": "",
  				"type": "bool"
  			}
  		],
  		"payable": true,
  		"stateMutability": "payable",
  		"type": "function"
  	},
  	{
  		"constant": false,
  		"inputs": [],
  		"name": "kill",
  		"outputs": [],
  		"payable": false,
  		"stateMutability": "nonpayable",
  		"type": "function"
  	},
  	{
  		"constant": false,
  		"inputs": [
  			{
  				"name": "_recipients",
  				"type": "address[]"
  			}
  		],
  		"name": "setRecipients",
  		"outputs": [
  			{
  				"name": "",
  				"type": "bool"
  			}
  		],
  		"payable": false,
  		"stateMutability": "nonpayable",
  		"type": "function"
  	},
  	{
  		"constant": true,
  		"inputs": [
  			{
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"name": "recipientAddress",
  		"outputs": [
  			{
  				"name": "",
  				"type": "address"
  			}
  		],
  		"payable": false,
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"constant": true,
  		"inputs": [],
  		"name": "viewRecipients",
  		"outputs": [
  			{
  				"name": "",
  				"type": "address[]"
  			}
  		],
  		"payable": false,
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"constant": true,
  		"inputs": [],
  		"name": "owner",
  		"outputs": [
  			{
  				"name": "",
  				"type": "address"
  			}
  		],
  		"payable": false,
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"constant": false,
  		"inputs": [
  			{
  				"name": "_newOwner",
  				"type": "address"
  			}
  		],
  		"name": "changeOwner",
  		"outputs": [],
  		"payable": false,
  		"stateMutability": "nonpayable",
  		"type": "function"
  	},
  	{
  		"constant": true,
  		"inputs": [],
  		"name": "numberRecipients",
  		"outputs": [
  			{
  				"name": "",
  				"type": "uint256"
  			}
  		],
  		"payable": false,
  		"stateMutability": "view",
  		"type": "function"
  	},
  	{
  		"constant": false,
  		"inputs": [],
  		"name": "reset",
  		"outputs": [],
  		"payable": false,
  		"stateMutability": "nonpayable",
  		"type": "function"
  	},
  	{
  		"payable": true,
  		"stateMutability": "payable",
  		"type": "fallback"
  	}
  ]`
  };

  handleChange = (e, { value }) => this.setState({ input: value });

  handleSubmit = () => {
    console.log("Creating DApp...");

    let abiObject = "";
    try {
      abiObject = JSON.parse(`{ "method": ${this.state.input} }`);
    } catch (error) {
      console.log("ABI invalid, please check formatting");
      return;
    }

    this.setState({ abiFormatted: JSON.stringify(abiObject) });
  };

  renderInterface() {
    return (
      <div>
        <Header>Calls:</Header>
        {this.renderCalls()}
        <Header>Views:</Header>
        {this.renderViews()}
      </div>
    );
  }

  renderCalls() {
    var items = [];
    if (this.state.abiFormatted) {
      const abiObject = JSON.parse(this.state.abiFormatted);
      // Build the input form
      abiObject.method.map(method => {
        if (method.stateMutability != "view" && method.type === "function") {
          console.log(`# ${method.name}`);
          if (method.inputs.length) {
            console.log(`   Inputs:`);
            let inputs;
            method.inputs.map(input => {
              console.log(`    ${input.type} ${input.name}`);
              items.push(
                <Form>
                  <Form.Input
                    label={method.name}
                    placeholder={input.type}
                    // value={this.state.input}
                    // onChange={this.handleChange}
                  />
                  <Form.Button onClick={this.handleSubmit} content="Submit" />
                </Form>
              );
            });
          }
          // Add a value box if payable
          if (method.payable) {
            console.log(`   Inputs: (payable)`);
            // Make an input form with a value
            items.push(
              <Form>
                <Form.Input
                  label={method.name}
                  placeholder="value"
                  // value={this.state.input}
                  // onChange={this.handleChange}
                />
                <Form.Button onClick={this.handleSubmit} content="Submit" />
              </Form>
            );
          }
        }
      });
    }
    return <div>{items}</div>;
  }

  renderViews() {
    var items = [];
    if (this.state.abiFormatted) {
      const abiObject = JSON.parse(this.state.abiFormatted);
      // Build the input form
      abiObject.method.map(method => {
        if (method.stateMutability === "view") {
          console.log(`%% ${method.name}`);
          items.push(<Button text={method.name} />);
        }
      });
    }
    return <div>{items}</div>;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">One-Click DApp</h1>
        </header>
        <Form>
          <Form.TextArea
            label="Contract ABI"
            placeholder="ABI"
            value={this.state.input}
            onChange={this.handleChange}
          />
          <Form.Button onClick={this.handleSubmit} content="DApp it up!" />
        </Form>
        {this.renderInterface()}
      </div>
    );
  }
}

export default App;
