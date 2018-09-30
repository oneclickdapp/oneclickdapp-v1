import React, { Component } from "react";

//Styles
import "./App.css";
import {
  Grid,
  // List,
  Button,
  // Table,
  // Input,
  Message,
  Form,
  // Card,
  // Divider,
  Segment,
  Header,
  Icon,
  Label
} from "semantic-ui-react";

// ABI for test purposes
import sampleABI from "./ethereum/sampleABI";

// Ethereum components
import web3 from "./ethereum/web3";

class App extends Component {
  state = {
    abiFormatted: "",
    abi: JSON.stringify(sampleABI),
    network: "",
    contractAddress: "",
    errorMessage: "",
    loading: false,
    methodArguments: []
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  // Takes inputs from the user and stores them to JSON object methodArguments
  handleArgumentsChange = (e, { name, inputkey, value }) => {
    var newArguments = this.state.methodArguments;
    let methodFound = false;

    // Iterate through the array to find the right method
    newArguments.forEach(method => {
      if (method.name === name) {
        methodFound = true;
        method.inputs[inputkey] = value;
      }
    });
    // Make a new entry if the method doesn't exist.
    if (!methodFound) {
      newArguments.push({ name: name, inputs: [] });
      newArguments[newArguments.length - 1].inputs[inputkey] = value;
    }
    this.setState({ methodArguments: newArguments });
    console.log(JSON.stringify(this.state.methodArguments));
  };

  handleSubmitFunction = (e, { name }) => {
    console.log("submitting function to the blockchain...");
  };

  handleSubmitDapp = () => {
    console.log("Creating DApp...");
    this.setState({
      errorMessage: "",
      abiFormatted: ""
    });
    // Check for proper formatting and create a new contract instance
    try {
      const myContract = new web3.eth.Contract(
        JSON.parse(this.state.abi),
        this.state.contractAddress
      );
      // Save the formatted abi for use in renderInterface()
      this.setState({
        abiFormatted: JSON.stringify(myContract.options.jsonInterface)
      });
    } catch (err) {
      this.setState({
        errorMessage: err.message
      });
      return;
    }
  };

  // "Send" functions alter the contract state, and require gas.
  async handleSubmitFunction() {
    console.log("Doing function 'send'...");

    // try {
    //   const accounts = await web3.eth.getAccounts();
    //   await game.methods.register(this.state.name).send({
    //     from: accounts[0],
    //     value: entryFee
    //   });
    //   // Router.pushRoute("/");
    //   Router.replaceRoute(`/games/${this.props.gameAddress}`);
    // } catch (err) {
    //   this.setState({ errorMessage: err.message });
    // }
  }

  // "Call" functions do not alter the contract state. No gas needed.
  handleSubmitView = () => {
    console.log("Doing view 'call'...");
  };

  renderInterface() {
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column>
            <Header>
              Functions <Header.Subheader>(must pay tx fee)</Header.Subheader>
            </Header>
            {this.renderFunctions()}
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

  renderFunctions() {
    var items = [];
    if (this.state.abiFormatted) {
      const abiObject = JSON.parse(this.state.abiFormatted);
      // Go through all methods
      abiObject.map((method, i) => {
        // Only use functions which are not view-only
        if (method.stateMutability !== "view" && method.type === "function") {
          const methodName = method.name;
          // console.log(`# ${methodName}`);
          // If it has arguments, then make a form
          if (method.inputs.length) {
            // console.log(`   Inputs:`);
            var inputItems = [];
            method.inputs.map((input, j) => {
              // console.log(`    ${input.type} ${input.name} key: ${j}`);
              inputItems.push(
                <Form.Input
                  name={methodName}
                  key={j}
                  inputkey={j}
                  // value={this.state.methodArguments[]}
                  inline
                  label={input.name}
                  placeholder={input.type}
                  onChange={this.handleArgumentsChange}
                />
              );
            });
            items.push(
              <Segment textAlign="left" key={i}>
                <Header textAlign="center">
                  {method.name}
                  <Header.Subheader>function</Header.Subheader>
                </Header>
                <Form key={i} onSubmit={this.handleSubmitFunction}>
                  {inputItems}
                  <Form.Button color="blue" content="Submit" />
                </Form>
              </Segment>
            );
          }
          // TODO incorporate payable function together with regular function
          // If it doesn't have arguments, but is payable, then make a form
          else if (method.payable) {
            // console.log(`   Inputs: (payable)`);
            // Make an input form with a value
            items.push(
              <Segment textAlign="left" key={i}>
                <Header textAlign="center">
                  {method.name}
                  <Header.Subheader>payable function</Header.Subheader>
                </Header>

                <Form onSubmit={this.handleSubmitFunction}>
                  <Form.Input
                    inline
                    label={`Amount in ETH`}
                    placeholder="value"
                  />
                  <Form.Button color="blue" content="Submit" />
                </Form>
              </Segment>
            );
          }
          // If it doesn't have arguments, and is not payable, then make a button
          else {
            // console.log(`   Inputs: (non-payable)`);
            items.push(
              <Segment textAlign="left" key={i}>
                <Header textAlign="center">
                  {method.name}
                  <Header.Subheader>function without inputs</Header.Subheader>
                </Header>
                <Form onSubmit={this.handleSubmitFunction}>
                  <Button color="blue" content="Go" />
                </Form>
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
      abiObject.map((method, i) => {
        if (method.stateMutability === "view") {
          // console.log(`%% VIEW ${method.name}`);
          if (method.outputs.length) {
            // console.log(`   Outputs:`);
            var outputItems = [];
            method.outputs.map((output, j) => {
              // console.log(`    ${output.type} ${output.name}`);
              let name = output.name || "(unnamed)";
              outputItems.push(
                <p key={j}>
                  {`${name}
                  ${output.type}`}
                </p>
              );
            });
            items.push(
              <Segment textAlign="left" key={i}>
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

  renderDappForm() {
    return (
      <Segment textAlign="left">
        <Form
          error={!!this.state.errorMessage}
          onSubmit={this.handleSubmitDapp}
        >
          <Form.TextArea
            inline
            label="Paste the ABI here:"
            placeholder="ABI"
            name="abi"
            value={this.state.abi}
            onChange={this.handleChange}
          />
          <Grid columns={2} textAlign="left">
            <Grid.Column>
              <Form.Input inline label="Network">
                <Form.Dropdown
                  placeholder="Main, Ropsten, Rinkeby ..."
                  selection
                  name="network"
                  onChange={this.handleChange}
                  options={[
                    { key: "Main", value: "main", text: "Main" },
                    { key: "Ropsten", value: "ropsten", text: "Ropsten" },
                    { key: "Rinkeby", value: "rinkeby", text: "Rinkeby" },
                    { key: "Kovan", value: "kovan", text: "Kovan" },
                    { key: "local-host", value: "local", text: "local-host" }
                  ]}
                  value={this.state.network}
                />
              </Form.Input>
              <Form.Input
                inline
                name="contractAddress"
                label="Contract"
                placeholder="0xab123..."
                value={this.state.contractAddress}
                onChange={this.handleChange}
              />
            </Grid.Column>
            <Grid.Column textAlign="center" verticalAlign="bottom">
              <Button color="green" content="DApp it up!" />
            </Grid.Column>
          </Grid>
          <Message error header="Oops!" content={this.state.errorMessage} />
        </Form>
      </Segment>
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">One-Click DApp</h1>
        </header>
        {this.renderDappForm()}
        {this.renderInterface()}
      </div>
    );
  }
}

export default App;
