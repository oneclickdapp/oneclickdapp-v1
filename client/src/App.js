import React, { Component } from 'react';
import './App.css';
import {
  Grid,
  Message,
  Form,
  Menu,
  Segment,
  Header,
  Icon,
  Button
} from 'semantic-ui-react';
import {
  Dapparatus,
  Metamask,
  Gas,
  ContractLoader,
  Transactions,
  Events,
  Scaler,
  Blockie,
  Address
} from 'dapparatus';
import Web3 from 'web3';
import web3 from './ethereum/web3';
import moment from 'moment';
import sampleABI from './ethereum/sampleABI1'; // ABI for test purposes
const axios = require('axios');
//Dapparatus
const METATX = {
  endpoint: 'http://0.0.0.0:10001/',
  contract: '0xf5bf6541843D2ba2865e9aeC153F28aaD96F6fbc'
  //accountGenerator: "//account.metatx.io",
};
const WEB3_PROVIDER = 'http://0.0.0.0:8545';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abi: '',
      abiRaw: '',
      requiredNetwork: '',
      contractAddress: '',
      errorMessage: '',
      errorMessageView: '',
      loading: false,
      methodData: [],
      contractName: '',
      mnemonic: '',
      recentContracts: {},
      userContracts: {},
      //new from dapparatus
      web3: false,
      account: false,
      gwei: 4,
      doingTransaction: false
    };
  }

  componentDidMount = async () => {
    this.loadExistingContract();
    this.loadRecentContracts();
    this.loadUser();
  };

  loadExistingContract = () => {
    const mnemonic = window.location.pathname;
    if (mnemonic.length > 0) {
      axios
        .get(`/contracts${mnemonic}`)
        .then(result => {
          this.setState({
            requiredNetwork: result.data.network || '',
            contractName: result.data.contractName || '',
            contractAddress: result.data.contractAddress || '',
            mnemonic: mnemonic
          });
          this.handleChangeABI(
            {},
            { value: JSON.stringify(result.data.abi) || '' }
          );
        })
        .catch(function(err) {
          console.log(err);
        });
    } else {
      this.handleChangeABI({}, { value: this.state.abiRaw });
    }
  };

  loadRecentContracts = () => {
    axios
      .get(`/contracts/recentContracts`)
      .then(response => {
        this.setState({ recentContracts: response.data.recentContracts });
      })

      .catch(err => console.log(err));
  };

  loadUser = () => {
    axios
      .get(`/user/abc`)
      .then(response => {
        this.setState({ userContracts: response.data });
      })
      .catch(err => console.log(err));
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleInput(e) {
    let update = {};
    update[e.target.name] = e.target.value;
    this.setState(update);
  }

  handleChangeABI = (e, { value }) => {
    this.setState({ abiRaw: value, loading: true });
    const { contractAddress } = this.state;
    this.setState({ errorMessage: '', abi: '' });
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
    this.setState({ loading: false });
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
    const { contractName, contractAddress, abiRaw, requiredNetwork } = this.state;
    const abi = JSON.parse(abiRaw);
    console.log('Generating unique URL...' + contractAddress);
    axios
      .post(`/contracts`, {
        contractName,
        contractAddress,
        abi,
        network: requiredNetwork,
        walletAddress: 'abc'
      })
      .then(res => {
        window.location.pathname = `${res.data.mnemonic}`;
      })
      .catch(err => {
        console.log(err);
      })
      .then(res => {});
  };

  // send() methods alter the contract state, and require gas.
  handleSubmitSend = (e, { name }) => {
    console.log("Performing function 'send()'...");
    this.setState({ errorMessage: '' });
    const { methodData, abi, contractAddress } = this.state;

    // note: only gets first method. There could be more!
    // TODO fix this ^
    const method = methodData.find(method => method.name === name);
    if (!method) {
      this.setState({ errorMessage: 'You must enter some values' });
    } else {
      console.log('method submitted' + JSON.stringify(method));
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
    this.setState({ errorMessage: '' });
    // note: only gets first method. There could be more with identical name
    // TODO fix this ^
    const methodIndex = methodData.findIndex(method => method.name === name);
    const method = methodData[methodIndex];
    let inputs = method.inputs || []; // return an empty array if no inputs exist
    // Generate the contract object
    // TODO instead use the contract instance created during submitDapp()
    const myContract = new web3.eth.Contract(JSON.parse(abi), contractAddress);
    try {
      // using "..." to destructure inputs[]
      myContract.methods[name](...inputs)
        .call()
        .then(response => {
          if (typeof response === 'object') {
            Object.entries(response).forEach(
              ([key, value]) =>
                (newMethodData[methodIndex].outputs[key] = value)
            );
          } else newMethodData[methodIndex].outputs[0] = response;
          this.setState({ methodData: newMethodData });
        });
    } catch (err) {
      this.setState({ errorMessageView: err.message });
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

  renderDappForm() {
    return (
      <Segment textAlign="left">
        <Form
          error={!!this.state.errorMessage}
          onSubmit={this.handleGenerateURL}
        >
          <Grid stackable columns={3}>
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
                  placeholder="Mainnet, Ropsten, Rinkeby ..."
                  selection
                  inline
                  name="requiredNetwork"
                  onChange={this.handleChange}
                  options={[
                    { key: 'Mainnet', value: 'Mainnet', text: 'Mainnet' },
                    { key: 'Ropsten', value: 'Ropsten', text: 'Ropsten' },
                    { key: 'Rinkeby', value: 'Rinkeby', text: 'Rinkeby' },
                    { key: 'Kovan', value: 'Kovan', text: 'Kovan' },
                    {
                      key: 'Private',
                      value: 'Private',
                      text: 'Private (local-host)'
                    }
                  ]}
                  value={this.state.requiredNetwork}
                />
              </Form.Input>
              <Button color="green" content="Get Shareable Link" />
              <br />
              <a href={`http://OneClickDApp.com${this.state.mnemonic}`}>
                OneClickDApp.com{this.state.mnemonic || '/ ...'}
              </a>
            </Grid.Column>
            {this.renderRecentHistory()}
            {this.renderUserHistory()}
          </Grid>
          <Message error header="Oops!" content={this.state.errorMessage} />
        </Form>
      </Segment>
    );
  }

  renderInterface() {
    return (
      <div>
        <Grid stackable columns={2}>
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

  renderRecentHistory() {
    const { recentContracts } = this.state;
    return (
      <Grid.Column>
        <Header>
          <Icon name="globe" />User created DApps
        </Header>
        <div className="vertical-menu">
          <Menu vertical>
            {recentContracts.length > 0 ? (
              recentContracts.map((contract, index) => (
                <Menu.Item
                  key={index}
                  href={`//oneclickdapp.com/${contract.mnemonic}`}
                >
                  <Menu.Header>{contract.contractName}</Menu.Header>
                  {contract.network.toUpperCase()} Network <br />Created{' '}
                  {moment(contract.createdAt).fromNow()}
                </Menu.Item>
              ))
            ) : (
              <p>No contracts found.</p>
            )}
          </Menu>
        </div>
      </Grid.Column>
    );
  }

  renderUserHistory() {
    const { userContracts } = this.state;
    return (
      <Grid.Column>
        <Header>Your recent DApps</Header>
        <div className="vertical-menu">
          <Menu vertical>
            {userContracts !== undefined && userContracts.length > 0 ? (
              userContracts.map((contract, index) => (
                <Menu.Item
                  key={index}
                  href={`//oneclickdapp.com/${contract.mnemonic}`}
                >
                  <Menu.Header>{contract.contractName}</Menu.Header>
                  {contract.network.toUpperCase()} Network <br />Created{' '}
                  {moment(contract.createdAt).fromNow()}
                </Menu.Item>
              ))
            ) : (
              <p>No contracts found.</p>
            )}
          </Menu>
        </div>
      </Grid.Column>
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
          if (method.stateMutability !== 'view' && method.type === 'function') {
            var formInputs = []; // Building our individual inputs
            var methodTypeHelperText = 'function without arguments'; // Default function
            // If it takes arguments, create form inputs
            // console.log(`   Inputs:`);
            method.inputs.forEach((input, j) => {
              // console.log(`    ${input.type} ${input.name} key: ${j}`);
              methodTypeHelperText = 'function';
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
              methodTypeHelperText = 'payable function';
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
              Invalid ABI Format, please read more about ABI{' '}
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
          if (method.stateMutability === 'view') {
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
              const outputData = methodData[i].outputs[j];

              methodOutputs.push(
                <p key={j}>
                  {`${output.name || '(unnamed)'}
                ${output.type}: ${outputData || ''}`}
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
                  <Button floated="right" icon>
                    <Icon name="refresh" />
                  </Button>
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

  render() {
    let {
      web3,
      account,
      contracts,
      tx,
      gwei,
      block,
      avgBlockTime,
      etherscan,
      requiredNetwork
    } = this.state;
    let connectedDisplay = [];
    let contractsDisplay = [];
    // if (web3) {
    // connectedDisplay.push(
    //   <Gas
    //     key="Gas"
    //     onUpdate={state => {
    //       console.log('Gas price update:', state);
    //       this.setState(state, () => {
    //         console.log('GWEI set:', this.state);
    //       });
    //     }}
    //   />
    // );
    // connectedDisplay.push(
    //   <ContractLoader
    //     key="ContractLoader"
    //     config={{ DEBUG: true }}
    //     web3={web3}
    //     require={path => {
    //       return require(`${__dirname}/${path}`);
    //     }}
    //     onReady={(contracts, customLoader) => {
    //       console.log('contracts loaded', contracts);
    //       this.setState({ contracts: contracts }, async () => {
    //         console.log('Contracts Are Ready:', this.state.contracts);
    //       });
    //     }}
    //   />
    // );
    // connectedDisplay.push(
    //   <Transactions
    //     key="Transactions"
    //     config={{ DEBUG: false }}
    //     account={account}
    //     gwei={gwei}
    //     web3={web3}
    //     block={block}
    //     avgBlockTime={avgBlockTime}
    //     etherscan={etherscan}
    //     onReady={state => {
    //       console.log('Transactions component is ready:', state);
    //       this.setState(state);
    //     }}
    //     onReceipt={(transaction, receipt) => {
    //       // this is one way to get the deployed contract address, but instead I'll switch
    //       //  to a more straight forward callback system above
    //       console.log('Transaction Receipt', transaction, receipt);
    //     }}
    //   />
    // );

    //}

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">One Click DApp</h1>
        </header>
        <Dapparatus
          config={{
            DEBUG:false,
            requiredNetwork:[requiredNetwork],
          }}
          metatx={METATX}
          fallbackWeb3Provider={new Web3.providers.HttpProvider(WEB3_PROVIDER)}
          onUpdate={(state)=>{
           console.log("metamask state update:",state)
           if(state.web3Provider) {
             state.web3 = new Web3(state.web3Provider)
             this.setState(state)
           }
          }}
        />
        <p>Curently in alpha. Help make this open-source app awesome: </p>
        <a href="https://github.com/blockchainbuddha/one-click-DApps">Github</a>
        {this.renderDappForm()}
        {this.renderInterface()}
        {connectedDisplay}
        {contractsDisplay}
      </div>
    );
  }
}

export default App;
