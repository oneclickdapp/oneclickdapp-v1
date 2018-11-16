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
  Button,
  Progress,
  Divider,
  Popup,
  Container,
  Table,
  Link,
  Image,
  Transition,
  Search,
  Dropdown
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
import _ from 'lodash';
import sampleABI from './ethereum/sampleABI1'; // ABI for test purposes
import PropTypes from 'prop-types';

const axios = require('axios');
//Dapparatus
const METATX = {
  endpoint: 'http://0.0.0.0:10001/',
  contract: '0xf5bf6541843D2ba2865e9aeC153F28aaD96F6fbc'
  //accountGenerator: "//account.metatx.io",
};
const WEB3_PROVIDER = 'http://0.0.0.0:8545';
// assets
const chelsea = require('./assets/chelsea.png');
const boulder = require('./assets/boulder.png');
const cloud = require('./assets/cloud.png');
const tablet = require('./assets/tablet.png');
const triframe = require('./assets/triframe.png');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abi: '',
      abiRaw: JSON.stringify(sampleABI),
      requiredNetwork: 'Roptsen',
      contractAddress: '0x5f462bcCD7617D0B81feEf9e4B0C9Af0909eA980',
      contractName: 'cry',
      errorMessage: '',
      errorMessageView: '',
      loading: false,
      methodData: [],
      mnemonic: '',
      recentContracts: {},
      userSavedContracts: {},
      externalContracts: [],
      userHasBeenLoaded: false,
      //Search
      results: '',
      isLoading: false,
      // Display states
      currentDappFormStep: 3,
      displayDappForm: true,
      displayLoading: false,
      displayGeneratingDapp: true,
      //new from dapparatus
      web3: false,
      account: false,
      gwei: 4,
      doingTransaction: false
    };
  }
  componentDidMount = async () => {
    this.getURLContract();
    this.getRecentPublicContracts();
    this.getExternalContracts();
  };
  componentDidUpdate() {
    if (!this.state.userHasBeenLoaded && this.state.account) {
      this.getUserSavedContracts();
    }
  }
  getURLContract = () => {
    const mnemonic = window.location.pathname;
    if (mnemonic.length > 1) {
      const loading = (
        <div>
          <Icon loading name="spinner" /> Loading dApp...
        </div>
      );
      this.setState({
        displayDappForm: false,
        displayLoading: loading
      });
      axios
        .get(`/contracts${mnemonic}`)
        .then(result => {
          // from contractLoader
          // let resultingContract = {};
          // let contract = new web3.eth.Contract(
          //   result.data.abi,
          //   result.data.contractAddress
          // );
          // resultingContract = contract.methods;
          // resultingContract._blocknumber = '';
          // resultingContract._address = result.data.contractAddress;
          // resultingContract._abi = result.data.abi;
          // resultingContract._contract = contract;
          // // from componentDidMount
          // let contracts = {};
          // contracts['custom'] = resultingContract;
          this.setState({
            requiredNetwork: result.data.network || '',
            contractName: result.data.contractName || '',
            contractAddress: result.data.contractAddress || '',
            mnemonic: mnemonic,
            displayDappForm: false,
            displayLoading: false
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
  getRecentPublicContracts = () => {
    axios
      .get(`/contracts/recentContracts`)
      .then(response => {
        this.setState({ recentContracts: response.data.recentContracts });
      })

      .catch(err => console.log(err));
  };
  getUserSavedContracts = () => {
    const { account } = this.state;
    axios
      .get(`/user/${account}`)
      .then(response => {
        this.setState({
          userSavedContracts: response.data,
          userHasBeenLoaded: true
        });
      })
      .catch(err => console.log(err));
  };
  getExternalContracts = () => {
    axios
      .get(`/contracts/externalContracts`)
      .then(response => {
        this.setState({
          externalContracts: response.data.externalContracts
        });
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
  handleGenerateDapp = () => {
    const {
      contractName,
      contractAddress,
      abiRaw,
      requiredNetwork,
      account
    } = this.state;
    const displayLoading = (
      <div>
        <Header>
          <Icon loading name="load" />Creating your dApp...
        </Header>
        <Image centered src={triframe} />
      </div>
    );
    this.setState({
      displayLoading
    });
    const abi = JSON.parse(abiRaw);
    console.log('Generating unique URL...' + account);
    axios
      .post(`/contracts`, {
        contractName,
        contractAddress,
        abi,
        network: requiredNetwork,
        creatorAddress: account
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
  resetComponent = () =>
    this.setState({ isLoading: false, results: [], contractName: '' });
  handleResultSelect = (e, { result }) => {
    const name = `${result.name} (clone)`;
    this.setState({
      contractName: name,
      requiredNetwork: 'Mainnet',
      contractAddress: result.address,
      abiRaw: JSON.stringify(result.abi),
      currentDappFormStep: 2
    });
  };
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, contractName: value });
    setTimeout(() => {
      if (this.state.contractName.length < 1) return this.resetComponent();
      const re = new RegExp(_.escapeRegExp(this.state.contractName), 'i');
      const isMatch = result => re.test(result.name);
      this.setState({
        isLoading: false,
        results: _.filter(this.state.externalContracts, isMatch)
      });
    }, 300);
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
    const { currentDappFormStep, displayLoading } = this.state;
    let formDisplay = [];
    if (displayLoading) {
      formDisplay = displayLoading;
    } else if (currentDappFormStep < 1) {
      formDisplay = (
        <div>
          <Header>Hi, I'm Chelsea!</Header>
          <Image centered size="medium" src={chelsea} />
        </div>
      );
    } else if (currentDappFormStep == 1) {
      const resultRenderer = ({ name, source }) => (
        <div>
          <Table.Row>
            <Table.Cell>
              <Header>{name}</Header>
            </Table.Cell>
            <Table.Cell>{source}</Table.Cell>
          </Table.Row>
        </div>
      );
      resultRenderer.propTypes = {
        name: PropTypes.string,
        source: PropTypes.string,
        address: PropTypes.string,
        abi: PropTypes.object
      };
      formDisplay = (
        <div>
          <Image centered size="tiny" src={tablet} />
          <Header as="h2">
            Create a new dApp
            <Header.Subheader>
              or clone an existing one <Icon name="clone" />
            </Header.Subheader>
          </Header>
          <Form
            error={!!this.state.errorMessage}
            onSubmit={() => this.setState({ currentDappFormStep: 2 })}
          >
            <Grid>
              <Grid.Column>
                <Search
                  size="large"
                  noResultsMessage="Hit `Enter` to create a new dApp!"
                  loading={this.state.isLoading}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true
                  })}
                  placeholder="myDApp"
                  value={this.state.contractName}
                  results={this.state.results}
                  resultRenderer={resultRenderer}
                  onResultSelect={this.handleResultSelect}
                />
              </Grid.Column>
            </Grid>
          </Form>
          <Grid columns={2} centered stackable>
            <Grid.Column>{this.renderUserHistory()}</Grid.Column>
            <Grid.Column>{this.renderGlobalHistory()}</Grid.Column>
          </Grid>
        </div>
      );
    } else if (currentDappFormStep == 2) {
      formDisplay = (
        <div>
          <Header as="h2" icon textAlign="center">
            <Icon name="file code outline" circular />
            Enter details for "{this.state.contractName}"
          </Header>
          <Segment textAlign="center">
            <Form
              textAlign="center"
              error={!!this.state.errorMessage}
              onSubmit={this.handleGenerateDapp}
            >
              <Form.Group inline>
                <Form.Input
                  inline
                  required
                  name="contractAddress"
                  label="Address"
                  placeholder="0xab123..."
                  value={this.state.contractAddress}
                  onChange={this.handleChange}
                />
                <Form.Input inline label="Network">
                  <Form.Dropdown
                    required
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
              </Form.Group>

              <Form.TextArea
                required
                label={
                  <div>
                    Interface ABI{' '}
                    <Popup
                      flowing
                      hoverable
                      trigger={<Icon name="question circle" />}
                    >
                      Issues with your Application Binary Interface? Be sure its
                      in the proper formated listed in the{' '}
                      <a
                        target="_blank"
                        href="https://solidity.readthedocs.io/en/latest/abi-spec.html?highlight=abi#json"
                      >
                        Solidity docs
                      </a>.
                    </Popup>
                  </div>
                }
                placeholder={`[{"constant": false,"inputs": [],"name": "distributeFunds", "outputs": [{"name": "","type": "bool"}],"payable": true, "stateMutability": "payable","type": "function"}...]`}
                value={this.state.abiRaw}
                onChange={this.handleChangeABI}
              />

              <Message error header="Oops!" content={this.state.errorMessage} />
            </Form>
          </Segment>
        </div>
      );
    } else if (currentDappFormStep == 3) {
      formDisplay = (
        <div>
          <Header as="h2" icon textAlign="center">
            <Icon name="shield alternate" circular />
            Choose your security
          </Header>
          <Grid columns={2} textAlign="center">
            <Grid.Row>
              <Header>
                Low
                <Header.Subheader>
                  Instant<br />Free
                </Header.Subheader>
              </Header>
              <Button
                size="huge"
                icon="lightning"
                color="green"
                content="Create dApp"
                onClick={this.handleGenerateDapp}
                content="Create dApp"
              />
            </Grid.Row>
            <Divider />
            <Grid.Row>
              <Grid.Column textAlign="right">
                <Image src={tablet} size="mini" inline />
                <Header>
                  High
                  <Header.Subheader>
                    <Icon name="time" />>30s<br />
                    Permanent
                  </Header.Subheader>
                </Header>
              </Grid.Column>
              <Grid.Column textAlign="left">
                <Button
                  size="huge"
                  icon="lock"
                  color="green"
                  onClick={this.handleGenerateDapp}
                  content="Create dApp"
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            fontSize: 16,
            zIndex: 5,
            position: 'fixed',
            paddingTop: 30,
            marginBottom: 0,
            textAlign: 'left',
            top: 100,
            left: 10,
            opacity: 1,

            width: 220,
            paddingLeft: 10
          }}
        >
          <Button
            basic
            floated
            hidden={!currentDappFormStep}
            name="currentDappFormStep"
            value={currentDappFormStep - 1 < 1 ? 0 : currentDappFormStep - 1}
            icon="arrow left"
            onClick={this.handleChange}
            content="back"
          >
            <Image size="mini" src={boulder} />
          </Button>
        </div>
        <div
          style={{
            fontSize: 16,
            zIndex: 5,
            position: 'fixed',
            paddingTop: 30,
            marginBottom: 0,
            textAlign: 'right',
            top: 100,
            right: 10,
            opacity: 1,
            width: 220,
            paddingRight: 10
          }}
        >
          <Button
            basic
            floated
            name="currentDappFormStep"
            value={currentDappFormStep - 1 > 1 ? 0 : currentDappFormStep + 1}
            icon="arrow left"
            onClick={this.handleChange}
            content="back"
          >
            <Image size="mini" src={boulder} />
          </Button>
        </div>
        <Container>
          <Progress
            text="step"
            value={currentDappFormStep}
            total="3"
            progress="ratio"
            color="teal"
            size="small"
          />
        </Container>
        {formDisplay}
      </div>
    );
  }
  renderInterface() {
    return (
      <div>
        Viewing {this.state.contractName}
        <a href={`http://OneClickDApp.com${this.state.mnemonic}`}>
          OneClickDApp.com{this.state.mnemonic || '/ ...'}
        </a>
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
  renderGlobalHistory() {
    const { recentContracts } = this.state;
    return (
      <div>
        <Header textAlign="center" as="h3" icon>
          <Icon name="globe" />Recent Public dApps
        </Header>
        <div style={{ overflow: 'auto', maxHeight: 300 }}>
          {recentContracts.length > 0 ? (
            <Table unstackable selectable>
              <Table.Header>
                <Table.Row textAlign="center">
                  <Table.HeaderCell>
                    <Icon name="pencil" />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Icon name="user" />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Icon name="ethereum" />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Icon name="clock outline" />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {recentContracts.map((contract, index) => (
                  <Table.Row
                    key={index}
                    onClick={() => {
                      window.location.pathname = `${contract.mnemonic}`;
                    }}
                  >
                    <Table.Cell>{contract.contractName}</Table.Cell>
                    <Table.Cell>
                      <Blockie
                        floated
                        config={{ size: 3 }}
                        address={contract.creatorAddress}
                      />
                    </Table.Cell>
                    <Table.Cell>{contract.network}</Table.Cell>
                    <Table.Cell>
                      {moment(contract.createdAt).fromNow()}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <Segment textAlign="center">Loading...</Segment>
          )}
        </div>
      </div>
    );
  }
  renderUserHistory() {
    const { userSavedContracts, account } = this.state;
    return (
      <div>
        <Header textAlign="center" as="h3" icon>
          <Icon name="save" />
          {<Blockie floated config={{ size: 2 }} address={account} /> || (
            <Icon name="user" />
          )}{' '}
          Saved dApps
        </Header>
        <div style={{ overflow: 'auto', maxHeight: 300 }}>
          {userSavedContracts !== undefined && userSavedContracts.length > 0 ? (
            <Table unstackable>
              <Table.Header>
                <Table.Row textAlign="center">
                  <Table.HeaderCell>
                    <Icon name="pencil" />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Icon name="ethereum" />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Icon name="clock outline" />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {userSavedContracts.map((contract, index) => (
                  <Table.Row
                    key={index}
                    onClick={() => {
                      window.location.pathname = `${contract.mnemonic}`;
                    }}
                  >
                    <Table.Cell>{contract.contractName}</Table.Cell>
                    <Table.Cell>{contract.network}</Table.Cell>
                    <Table.Cell>
                      {moment(contract.createdAt).fromNow()}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <Segment textAlign="center">
              You haven't created anything yet
            </Segment>
          )}
        </div>
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
      requiredNetwork,
      displayDappForm,
      displayLoading
    } = this.state;
    let connectedDisplay = [];
    let contractsDisplay = [];
    if (web3) {
      connectedDisplay.push(
        <Gas
          key="Gas"
          onUpdate={state => {
            console.log('Gas price update:', state);
            this.setState(state, () => {
              console.log('GWEI set:', this.state.gwei);
            });
          }}
        />
      );
      // connectedDisplay.push(
      //   <ContractLoader
      //     web3={web3}
      //     require={path => {return require(`${__dirname}/${path}`)}}
      //     onReady={(contracts)=>{
      //       console.log("contracts loaded",contracts)
      //       this.setState({contracts:contracts})
      //     }}
      //   />
      // );
      // debugger;
      // if (contracts) {
      // connectedDisplay.push(
      //   <Events
      //     config={{ hide: false }}
      //     contract={contracts}
      //     eventName={'Create'}
      //     block={block}
      //     id={'_id'}
      //     filter={{}}
      //     onUpdate={(eventData, allEvents) => {
      //       console.log('EVENT DATA:', eventData);
      //       this.setState({ events: allEvents });
      //     }}
      //   />
      // );
      if (!displayDappForm) {
        connectedDisplay.push(
          <Transactions
            key="Transactions"
            config={{ DEBUG: false }}
            account={account}
            gwei={gwei}
            web3={web3}
            block={block}
            avgBlockTime={avgBlockTime}
            etherscan={etherscan}
            onReady={state => {
              console.log('Transactions component is ready:', state);
              this.setState(state);
            }}
            onReceipt={(transaction, receipt) => {
              // this is one way to get the deployed contract address, but instead I'll switch
              //  to a more straight forward callback system above
              console.log('Transaction Receipt', transaction, receipt);
            }}
          />
        );
      }
    }

    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    let mainDisplay = [];
    if (displayLoading) {
      mainDisplay = displayLoading;
    } else if (displayDappForm) {
      mainDisplay = this.renderDappForm();
    } else {
      mainDisplay = this.renderInterface();
    }
    return (
      <div className="App">
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as="a" header href="http://oneclickdapp.com">
              <Image
                size="mini"
                src={chelsea}
                style={{ marginRight: '1.5em' }}
              />
              One Click dApp
            </Menu.Item>
            <Dropdown item simple text="About">
              <Dropdown.Menu>
                <Dropdown.Item icon="question" text="Help" />
                <Dropdown.Divider />
                <Dropdown.Header>Contact</Dropdown.Header>
                <Dropdown.Item
                  icon="github"
                  text="Github"
                  target="_blank"
                  href="https://github.com/blockchainbuddha/one-click-DApps"
                />
                <Dropdown.Item
                  icon="twitter"
                  text="twitter"
                  href="https://twitter.com/pi0neerpat"
                  target="_blank"
                />
              </Dropdown.Menu>
            </Dropdown>
            <Container>
              <Dapparatus
                config={{
                  DEBUG: false,
                  requiredNetwork: [requiredNetwork],
                  hide: false
                }}
                metatx={METATX}
                fallbackWeb3Provider={
                  new Web3.providers.HttpProvider(WEB3_PROVIDER)
                }
                onUpdate={state => {
                  console.log('metamask state update:', state);
                  if (state.web3Provider) {
                    state.web3 = new Web3(state.web3Provider);
                    this.setState(state);
                  }
                }}
              />
            </Container>
          </Container>
        </Menu>
        <Header as="h1" textAlign="left">
          One Click dApp
        </Header>

        {mainDisplay}
        {connectedDisplay}
      </div>
    );
  }
}

export default App;
