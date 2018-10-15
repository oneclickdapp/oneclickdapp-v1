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

// Components
import web3 from "./ethereum/web3";

// Using axios to fetch existing JSON contract data
const axios = require("axios");

class App extends Component {
  state = {
    abi: "",
    abiRaw: JSON.stringify(sampleABI),
    network: "Ropsten",
    contractAddress: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d",
    errorMessage: "",
    loading: false,
    methodData: [],
    contractName: "ETH Splitter Tool (example)",
    mnemonic: ""
  };

  componentDidMount = async () => {
    this.loadExistingContract();
  };

  loadExistingContract = () => {
    const mnemonic = window.location.pathname;
    axios
      .get(`./contracts/${mnemonic}`)
      .then(result => {
        this.setState({
          network: result.data.network || "",
          contractName: result.data.contractName || "",
          contractAddress: result.data.contractAddress || "",
          mnemonic: mnemonic
        });
        this.handleChangeABI(
          {},
          { value: JSON.stringify(result.data.abi) || "" }
        );
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleChangeABI = (e, { value }) => {
    this.setState({ abiRaw: value });
    const { contractAddress } = this.state;
    this.setState({ errorMessage: "", abi: "" });
    if (value) {
      // Don't run unless there is some text present
      // Check for proper formatting and create a new contract instance
      try {
        const abiObject = JSON.parse(value);
        const myContract = new web3.eth.Contract(abiObject, contractAddress);
        // Save the formatted abi for use in renderInterface()
        this.setState({
          abi: JSON.stringify(myContract.options.jsonInterface)
        });
        abiObject.forEach(method => this.createMethodData(method.name));
      } catch (err) {
        this.setState({
          errorMessage: err.message
        });
        return;
      }
    }
  };

  // Takes inputs from the user and stores them to JSON object methodArguments
  handleMethodDataChange = (e, { name, value, inputindex }) => {
    let newMethodData = this.state.methodData;
    const methodIndex = newMethodData.findIndex(method => method.name === name);
    newMethodData[methodIndex].inputs[inputindex] = value;
    this.setState({ methodData: newMethodData });
    // console.log(JSON.stringify(this.state.methodData));
  };

  handleGenerateURL = () => {
    const { contractName, contractAddress, abiRaw, network } = this.state;
    const abi = JSON.parse(abiRaw);
    console.log("Generating unique URL..." + contractAddress);
    axios
      .post(`/contracts`, {
        contractName,
        contractAddress,
        abi,
        network
      })
      .then(res => {
        window.location.pathname = res.data.mnemonic;
      })
      .catch(err => {
        console.log(err);
      })
      .then(res => {});
  };

  // send() methods alter the contract state, and require gas.
  handleSubmitSend = (e, { name }) => {
    console.log("Performing function 'send()'...");
    this.setState({ errorMessage: "" });
    const { methodData, abi, contractAddress } = this.state;

    // note: only gets first method. There could be more!
    // TODO fix this ^
    const method = methodData.find(method => method.name === name);
    if (!method) {
      this.setState({ errorMessage: "You must enter some values" });
    } else {
      console.log("method submitted" + JSON.stringify(method));
      // Generate the contract object
      // TODO instead use the contract instance created during submitDapp()
      const myContract = new web3.eth.Contract(
        JSON.parse(abi),
        contractAddress
      );

      try {
        web3.eth.getAccounts().then(accounts => {
          try {
            // using "..." to destructure inputs
            myContract.methods[method.name](...method.inputs).send({
              from: accounts[0]
            });
          } catch (err) {
            this.setState({ errorMessage: err.message });
          }
        });
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
    }
  };

  // call() methods do not alter the contract state. No gas needed.
  handleSubmitCall = (e, { name }) => {
    const { abi, contractAddress, methodData } = this.state;
    let newMethodData = methodData;

    this.setState({ errorMessage: "" });

    console.log(`${name}.call()`);
    // note: only gets first method. There could be more!
    // TODO fix this ^
    const method = methodData.find(method => method.name === name);
    // return an empty array if no inputs exist
    let inputs = method.inputs || [];

    // Generate the contract object
    // TODO use the contract instance created during submitDapp()
    const myContract = new web3.eth.Contract(JSON.parse(abi), contractAddress);

    try {
      // using "..." to destructure inputs[]
      myContract.methods[name](...inputs)
        .call()
        .then(response => {
          console.log(`call response: ${JSON.stringify(response)}`);
          const methodIndex = methodData.findIndex(
            method => method.name === name
          );
          // if (response.length > 1) {
          console.log("more than one response");
          response.forEach((output, index) => {
            newMethodData[methodIndex].outputs[index] = response;
          });
          console.log(`Call methodData outputs ${methodIndex}: `);
          // } else newMethodData[methodIndex].outputs[0] = response;
        });
      // Update with new output data
      this.setState({ methodData: newMethodData });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  createMethodData = name => {
    var newMethodData = this.state.methodData;
    // Check whether the method exists in the arguments list
    var methodExists = newMethodData.find(method => method.name === name);
    // Make a new entry if the method doesn't exist
    if (!methodExists) {
      newMethodData.push({ name: name, inputs: [], outputs: [] });
      this.setState({ methodData: newMethodData });
    }
    return newMethodData;
  };

  renderInterface() {
    return (
      <div>
        <Grid columns={2}>
          <Grid.Column>
            <Header>
              Functions <Header.Subheader>(must pay tx fee)</Header.Subheader>
            </Header>
            {this.renderSends()}
          </Grid.Column>
          <Grid.Column>
            <Header>
              Views
              <Header.Subheader>(free, read-only)</Header.Subheader>
            </Header>
            {this.renderCalls()}
          </Grid.Column>
        </Grid>
      </div>
    );
  }

  renderSends() {
    var forms = []; // Each Method gets a form
    if (this.state.abi) {
      // check that abi is ready
      try {
        const abiObject = JSON.parse(this.state.abi);
        abiObject.forEach((method, i) => {
          // Iterate only Methods, not Views. NOTE Doesn't get the fallback
          if (method.stateMutability !== "view" && method.type === "function") {
            var formInputs = []; // Building our individual inputs
            var methodTypeHelperText = "function without arguments"; // Default function
            // If it takes arguments, create form inputs
            // console.log(`   Inputs:`);
            method.inputs.forEach((input, j) => {
              // console.log(`    ${input.type} ${input.name} key: ${j}`);
              methodTypeHelperText = "function";
              formInputs.push(
                <Form.Input
                  name={method.name}
                  key={j}
                  inputindex={j}
                  inline
                  label={input.name}
                  placeholder={input.type}
                  onChange={this.handleMethodDataChange}
                />
              );
            });
            // If it doesn't have arguments, but is payable, then make a form
            if (method.payable) {
              // console.log(`   Inputs: (payable)`);
              methodTypeHelperText = "payable function";
              formInputs.push(
                <Form.Input
                  key={i}
                  inputindex={i}
                  name={method.name}
                  inline
                  label={`Amount in ETH`}
                  placeholder="value"
                  onChange={this.handleMethodDataChange}
                />
              );
            }
            forms.push(
              // Make a form, even when there are no inputs
              <Segment textAlign="left" key={i}>
                <Header textAlign="center">
                  {method.name}
                  <Header.Subheader>{methodTypeHelperText} </Header.Subheader>
                </Header>
                <Form
                  onSubmit={this.handleSubmitSend}
                  name={method.name}
                  key={i}
                >
                  {formInputs}
                  <Form.Button color="blue" content="Submit" />
                </Form>
              </Segment>
            );
          }
        });

        return <div>{forms}</div>;
      } catch (e) {
        return (
          <div>
            <h2>
              Invalid ABI Format, please read more about ABI{" "}
              <a href="https://solidity.readthedocs.io/en/develop/abi-spec.html">
                here.
              </a>
            </h2>
          </div>
        );
      }
    }
  }

  renderCalls() {
    const { abi, methodData } = this.state;
    var forms = []; // Each View gets a form

    if (abi) {
      try {
        const abiObject = JSON.parse(abi);
        // check that abi is ready
        abiObject.forEach((method, i) => {
          // Iterate only Views
          if (method.stateMutability === "view") {
            var methodInputs = []; // Building our inputs & outputs
            var methodOutputs = [];
            // If it takes arguments, create form inputs
            method.inputs.forEach((input, j) => {
              methodInputs.push(
                <Form.Input
                  name={method.name}
                  inputindex={j}
                  key={j}
                  inline
                  label={input.name}
                  placeholder={input.type}
                  onChange={this.handleMethodDataChange}
                />
              );
            });

            method.outputs.forEach((output, j) => {
              // console.log(
              //   `Render method outputs ${i} + ${j}: ${JSON.stringify(
              //     methodData[i].outputs
              //   )}`
              // );
              const outputData = methodData[i].outputs[j];

              methodOutputs.push(
                <p key={j}>
                  {`${output.name || "(unnamed)"}
                ${output.type}: ${outputData}`}
                </p>
              );
            });
            forms.push(
              <Segment textAlign="left" key={i}>
                <Header textAlign="center">
                  {method.name}
                  <Header.Subheader>View</Header.Subheader>
                </Header>
                <Form
                  onSubmit={this.handleSubmitCall}
                  name={method.name}
                  key={i}
                >
                  <Label basic image attached="top right">
                    <Button floated="right" icon>
                      <Icon name="refresh" />
                    </Button>
                  </Label>
                  {methodInputs}
                  {methodOutputs}
                </Form>
              </Segment>
            );
          }
        });
      } catch (e) {
        return null;
      }
    }
    return <div>{forms}</div>;
  }

  renderDappForm() {
    return (
      <Segment textAlign="left">
        <Form
          error={!!this.state.errorMessage}
          onSubmit={this.handleGenerateURL}
        >
          <Grid columns={2}>
            <Grid.Column>
              <Form.Input
                inline
                name="contractName"
                label="DApp name"
                placeholder="(optional)"
                value={this.state.contractName}
                onChange={this.handleChange}
              />
              <Form.TextArea
                label="ABI (application binary interface)"
                placeholder="ABI"
                value={this.state.abiRaw}
                onChange={this.handleChangeABI}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Input
                inline
                name="contractAddress"
                label="Contract address"
                placeholder="0xab123..."
                value={this.state.contractAddress}
                onChange={this.handleChange}
              />
              <Form.Input inline label="Network">
                <Form.Dropdown
                  placeholder="Main, Ropsten, Rinkeby ..."
                  selection
                  inline
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
              <Button color="green" content="Get Shareable Link" />
              <p>makeadapp.com{this.state.mnemonic || "/ ..."}</p>
            </Grid.Column>
          </Grid>
          <Message error header="Oops!" content={this.state.errorMessage} />
        </Form>
      </Segment>
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
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
