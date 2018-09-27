import React, { Component } from "react";

//Styles
import "./App.css";
import {
  Grid,
  // List,
  Button,
  // Table,
  // Input,
  // Message,
  Form,
  // Card,
  // Divider,
  Segment,
  Header,
  Icon,
  Label
} from "semantic-ui-react";

// ABI for test purposes
import testABI from "./ethereum/sampleABI";

class App extends Component {
  state = {
    abiFormatted: "",
    abi: JSON.stringify(testABI)
  };

  handleChange = (e, { value }) => this.setState({ abi: value });

  handleSubmit = () => {
    console.log("Creating DApp...");

    let abiObject = "";
    try {
      abiObject = JSON.parse(`{ "method": ${this.state.abi} }`);
    } catch (error) {
      console.log("ABI invalid, please check formatting");
      return;
    }

    this.setState({ abiFormatted: JSON.stringify(abiObject) });
  };

  renderInterface() {
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column>
            <Header>
              Functions <Header.Subheader>(must pay tx fee)</Header.Subheader>
            </Header>
            {this.renderCalls()}
          </Grid.Column>
          <Grid.Column>
            <Header>
              Views
              <Header.Subheader>(free, read-only)</Header.Subheader>
            </Header>
            {this.renderViews()}
          </Grid.Column>
        </Grid>
      </div>
    );
  }

  renderCalls() {
    var items = [];
    if (this.state.abiFormatted) {
      const abiObject = JSON.parse(this.state.abiFormatted);
      // Go through all methods
      abiObject.method.map(method => {
        // Only use functions which are not view-only
        if (method.stateMutability != "view" && method.type === "function") {
          console.log(`# ${method.name}`);
          // If it has arguments, then make a form
          if (method.inputs.length) {
            console.log(`   Inputs:`);
            var inputItems = [];
            method.inputs.map(input => {
              console.log(`    ${input.type} ${input.name}`);
              inputItems.push(
                <Form.Input
                  inline
                  label={input.name}
                  placeholder={input.type}
                  // value={this.state.input}
                  // onChange={this.handleChange}
                />
              );
            });
            items.push(
              <Segment textAlign="left">
                <Header textAlign="center">
                  {method.name}
                  <Header.Subheader>function</Header.Subheader>
                </Header>
                <Form>
                  {inputItems}
                  <Form.Button
                    color="blue"
                    onClick={this.handleSubmit}
                    content="Submit"
                  />
                </Form>
              </Segment>
            );
          }
          // If it doesn't have arguments, but is payable, then make a form
          else if (method.payable) {
            console.log(`   Inputs: (payable)`);
            // Make an input form with a value
            items.push(
              <Segment textAlign="left">
                <Header textAlign="center">
                  {method.name}
                  <Header.Subheader>payable function</Header.Subheader>
                </Header>

                <Form>
                  <Form.Input
                    inline
                    label={`Amount in ETH`}
                    placeholder="value"
                    // value={this.state.input}
                    // onChange={this.handleChange}
                  />
                  <Form.Button
                    color="blue"
                    onClick={this.handleSubmit}
                    content="Submit"
                  />
                </Form>
              </Segment>
            );
          }
          // If it doesn't have arguments, and is not payable, then make a button
          else {
            console.log(`   Inputs: (non-payable)`);
            items.push(
              <Segment textAlign="left">
                <Header textAlign="center">
                  {method.name}
                  <Header.Subheader>function without inputs</Header.Subheader>
                </Header>
                <Button color="blue" content="Go" />
              </Segment>
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
          console.log(`%% VIEW ${method.name}`);
          if (method.outputs.length) {
            console.log(`   Outputs:`);
            var outputItems = [];
            method.outputs.map(output => {
              console.log(`    ${output.type} ${output.name}`);
              let name = output.name || "(unnamed)";
              outputItems.push(
                <p>
                  {`${name}
                  ${output.type}`}
                </p>
              );
            });
            items.push(
              <Segment textAlign="left">
                <Header textAlign="center">
                  {method.name}
                  <Header.Subheader>payable function</Header.Subheader>
                </Header>
                <Label basic image attached="top right">
                  <Button floated="right" icon>
                    <Icon name="refresh" />
                  </Button>
                </Label>

                {outputItems}
              </Segment>
            );
          }
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
            label="Paste the ABI here:"
            placeholder="ABI"
            value={this.state.abi}
            onChange={this.handleChange}
          />
          <Form.Input inline label="Ethereum Network">
            <Form.Dropdown
              placeholder=""
              selection
              options={[
                { key: "Main", value: "main", text: "Main" },
                { key: "Ropsten", value: "ropsten", text: "Ropsten" },
                { key: "Rinkeby", value: "rinkeby", text: "Rinkeby" },
                { key: "Kovan", value: "kovan", text: "Kovan" },
                { key: "local-host", value: "local", text: "local-host" }
              ]}
            />
          </Form.Input>
          <Form.Input
            inline
            label="Contract"
            placeholder="0xab123..."
            // value={this.state.input}
            // onChange={this.handleChange}
          />
          <Form.Button onClick={this.handleSubmit} content="DApp it up!" />
        </Form>
        {this.renderInterface()}
      </div>
    );
  }
}

export default App;
