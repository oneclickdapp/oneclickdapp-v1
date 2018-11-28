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
  Popup,
  Container,
  Table,
  Image,
  Search,
  Dropdown
} from 'semantic-ui-react';
import {
  Dapparatus,
  Gas,
  // ContractLoader,
  // Transactions,
  // Events,
  // Scaler,
  Blockie
} from 'dapparatus';
// import { DapparatusCustom } from './components/DapparatusCustom';
import ContractLoaderCustom from './components/ContractLoaderCustom';
import TransactionsCustom from './components/transactionsCustom';
import Navigation from './components/Navigation';
import Web3 from 'web3';
import web3 from './ethereum/web3';
import moment from 'moment';
import _ from 'lodash';
// import sampleABI from './ethereum/sampleABI1'; // ABI for test purposes
import PropTypes from 'prop-types';
import { TwitterShareButton } from 'react-share';
// import solc from 'solc';
const axios = require('axios');
// Dapparatus
const METATX = {
  endpoint: 'http://0.0.0.0:10001/',
  contract: '0xf5bf6541843D2ba2865e9aeC153F28aaD96F6fbc'
  // accountGenerator: '//account.metatx.io'
};
const WEB3_PROVIDER = '';
// image assets
const chelseaHello = require('./assets/chelsea-hello.png');
const tablet = require('./assets/tablet.png');
const castle = require('./assets/castle.png');
const shield = require('./assets/shield.png');
const tent = require('./assets/tent.png');
const twitter = require('./assets/twitter.png');
const details = require('./assets/details.png');
const instructions = require('./assets/instructions.png');
const chiselProcess = require('./assets/chisel-process.png');
const market = require('./assets/market.png');
const treasure = require('./assets/treasure.png');
const clone = require('./assets/copy.png');
const pen = require('./assets/pen.png');
const user = require('./assets/user.png');
const ethereumSmall = require('./assets/ethereum-small.png');
const clock = require('./assets/clock.png');
const github = require(`./assets/github.png`);
const question = require(`./assets/question.png`);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abi: '',
      abiRaw: '',
      requiredNetwork: '',
      contractAddress: '',
      contractName: '',
      errorMessage: '',
      errorMessageView: '',
      loading: false,
      methodData: [],
      mnemonic: '',
      metaData: {},
      recentContracts: {},
      userSavedContracts: {},
      externalContracts: [],
      userHasBeenLoaded: false,
      // ENS
      ensSubnode: '',
      ensFee: 0.01,
      existingSubnodes: [],
      //Search
      results: [],
      isLoading: false,
      // Display states
      currentDappFormStep: 0,
      displayDappForm: true,
      displayLoading: false,
      //new from dapparatus
      enableDapparatus: false,
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
  getURLContract =  () => {
    const mnemonic = window.location.pathname;
    if (mnemonic.length > 1) {
      const loading = (
        <div>
          <Icon.Group size="huge">
            <Icon loading size="large" name="circle notch" />
            <Icon name="download" />
          </Icon.Group>
          <Header as="h2">Loading...</Header>
          <Image centered src={tablet} />
        </div>
      );
      this.setState({
        displayLoading: loading,
        requestAccessMetamask: true
      });
      axios
        .get(`/contracts${mnemonic}`)
        .then(result => {
          this.handleChangeABI(
            {},
            { value: JSON.stringify(result.data.abi) || '' }
          );
          this.setState({
            requiredNetwork: [result.data.network] || '',
            contractName: result.data.contractName || '',
            contractAddress: result.data.contractAddress || '',
            metaData: result.data.metaData || '',
            mnemonic: mnemonic,
            displayDappForm: false,
            displayLoading: false,
            enableDapparatus: true
          });
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
      .catch
      // err =>
      // console.log(err)
      ();
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
  getExistingSubnodes = () => {
    const values = [{ title: 'mydapp' }, { title: 'cooldapp' }];
    this.setState({ existingSubnodes: values });
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
    this.setState({ abi: '', abiRaw: value, loading: true, errorMessage: '' });
    const { contractAddress } = this.state;
    if (value) {
      // Don't run unless there is some text present
      // Check for proper formatting and create a new contract instance
      try {
        if (value.includes('pragma')) {
          // Check if it is a smart contract
          // console.log('input is a smart contract');
          // // var output = solc.compile(value);
          // console.log(JSON.stringify(output));
          // output.contracts['splitter'].interface;
          this.setState({ solidity: value });
        } else {
          // Parse the ABI normally and apply fixes as needed
          const abiObject = JSON.parse(value);
          // Name any unnammed outputs (fix for ABI/web3 issue on mainnet)
          abiObject.forEach((method, i) => {
            if (method.stateMutability === 'view') {
              method.outputs.forEach((output, j) => {
                if (!abiObject[i].outputs[j].name) {
                  abiObject[i].outputs[j].name = '(unnamed' + (j + 1) + ')';
                }
              });
            }
          });
          const myContract = new web3.eth.Contract(abiObject, contractAddress);
          // Save the formatted abi for use in renderInterface()
          this.setState({
            abi: JSON.stringify(myContract.options.jsonInterface)
          });
          abiObject.forEach(method => this.createMethodData(method.name));
        }
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
  handleMethodDataChange = (e, { name, value, inputindex, payable }) => {
    let newMethodData = this.state.methodData;
    const methodIndex = newMethodData.findIndex(method => method.name === name);
    if (inputindex === -1) {
      newMethodData[methodIndex].value = value;
    } else {
      newMethodData[methodIndex].inputs[inputindex] = value;
    }
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
        <Icon.Group size="huge">
          <Icon loading size="large" name="circle notch" />
          <Icon name="code" />
        </Icon.Group>
        <Header as="h2">Building your dApp...</Header>
        <Image centered src={chiselProcess} size="huge" />
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
    const { methodData, abi, contractAddress, account } = this.state;

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
        myContract.methods[method.name](...method.inputs).send({
          from: account,
          value: web3.utils.toWei(method.value || '0', 'ether')
        });
      } catch (err) {
        console.log(err.message);
        this.setState({ errorMessage: err.message });
      }
    }
  };
  // call() methods do not alter the contract state. No gas needed.
  handleSubmitCall = (e, { name }) => {
    const { abi, contractAddress, methodData } = this.state;
    console.log("Performing function 'call()'...");
    let newMethodData = methodData;
    this.setState({ errorMessage: '' });
    // note: only gets first method. There could be more with identical name
    // TODO fix this ^
    const methodIndex = methodData.findIndex(method => method.name === name);
    const method = methodData[methodIndex];
    console.log('method submitted' + JSON.stringify(method));
    let inputs = method.inputs || []; // return an empty array if no inputs exist
    // Generate the contract object
    // TODO instead use the contract instance created during submitDapp()
    const myContract = new web3.eth.Contract(JSON.parse(abi), contractAddress);
    try {
      // using "..." to destructure inputs[]
      myContract.methods[name](...inputs)
        .call({
          from: this.state.account
        })
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
    const name = `${result.title} (clone)`;
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
      if (value.length < 1) return this.resetComponent();
      const re = new RegExp(_.escapeRegExp(value), 'i');
      const isMatch = result => re.test(result.title);
      this.setState({
        isLoading: false,
        results: _.filter(this.state.externalContracts, isMatch)
      });
    }, 300);
  };
  handleEnsSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, ensSubnode: value });
    setTimeout(() => {
      if (value.length < 1) return this.resetComponent();
      const re = new RegExp(_.escapeRegExp(value), 'i');
      const isMatch = result => re.test(result.title);
      this.getExistingSubnodes();
      console.log(
        'existing subnodes:' + JSON.stringify(this.state.externalContracts)
      );
      console.log(
        'results' +
          JSON.stringify(_.filter(this.state.externalContracts, isMatch))
      );
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
          <Grid stackable>
            <Grid.Column width={7}>
              <Image align="right" size="large" src={chelseaHello} />
            </Grid.Column>
            <Grid.Column textAlign="left" width={8}>
              <Segment>
                <Header textAlign="center">
                  I'll help you chisel out a new dApp
                </Header>
                <ol>
                  <li>
                    Deploy your smart contract using{' '}
                    <a
                      href="http://remix.ethereum.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Remix
                    </a>
                    ,{' '}
                    <a
                      href="https://github.com/austintgriffith/clevis"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Clevis
                    </a>
                    , or{' '}
                    <a
                      href="https://truffleframework.com/tutorials/pet-shop"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Truffle.
                    </a>
                  </li>
                  <li>
                    Enter the
                    <a
                      href="https://solidity.readthedocs.io/en/latest/abi-spec.html?highlight=abi#handling-tuple-types"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {' '}
                      ABI
                    </a>
                    , network, and a name.
                  </li>
                  <li>Choose a security level (high/low).</li>
                </ol>
                Voila, your very own dApp at a unique URL:
                <Header textAlign="center">
                  oneclickdapp.com/stone-tablet
                </Header>
                <br />
                Bookmark and share with a friend!
              </Segment>
            </Grid.Column>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <Image centered size="huge" src={instructions} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Navigation
            step={currentDappFormStep}
            direction="right"
            onUpdate={state => {
              this.setState({
                currentDappFormStep: state.step,
                enableDapparatus: true
              });
            }}
          />
        </div>
      );
    } else if (currentDappFormStep === 1) {
      const resultRenderer = ({ title, source }) => [
        <div key={title}>
          <Header>{title}</Header>
          source: {source}
        </div>
      ];
      resultRenderer.propTypes = {
        title: PropTypes.string,
        source: PropTypes.string
      };

      formDisplay = (
        <div>
          <Image src={pen} size="small" centered />
          <Header as="h2">
            Create a new dApp
            <Header.Subheader>
              or clone an existing one <Image src={clone} size="mini" inline />
            </Header.Subheader>
          </Header>
          <Form
            error={!!this.state.errorMessage}
            onSubmit={() => this.setState({ currentDappFormStep: 2 })}
          >
            <Search
              fluid
              size="large"
              noResultsMessage="No results found"
              noResultsDescription="'Enter' to create a new dApp!"
              loading={this.state.isLoading}
              onSearchChange={_.debounce(this.handleSearchChange, 500, {
                leading: true
              })}
              placeholder="myDApp"
              value={this.state.contractName}
              results={this.state.results}
              resultRenderer={resultRenderer}
              onResultSelect={this.handleResultSelect}
              required={true}
            />
            <Navigation direction="right" formSubmit={true} />
          </Form>
          <br />
          <Grid columns={2} centered stackable>
            <Grid.Column>
              <Segment>{this.renderUserHistory()}</Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>{this.renderGlobalHistory()}</Segment>
            </Grid.Column>
          </Grid>
          <Navigation
            step={currentDappFormStep}
            direction="left"
            onUpdate={state => {
              this.setState({ currentDappFormStep: state.step });
            }}
          />
        </div>
      );
    } else if (currentDappFormStep === 2) {
      formDisplay = (
        <div>
          <Image centered size="small" src={details} />
          <Header as="h2" textAlign="center">
            Enter details for "{this.state.contractName}"
          </Header>
          <Grid textAlign="center">
            <Segment compact textAlign="center">
              <Form
                error={!!this.state.errorMessage}
                onSubmit={() =>
                  this.setState({
                    currentDappFormStep: 3
                  })
                }
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
                  <Form.Input required>
                    <Form.Dropdown
                      placeholder="Mainnet, Ropsten, Rinkeby..."
                      label="Network"
                      required
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
                          value: 'Unknown',
                          text: 'Private (local-host)'
                        }
                      ]}
                      value={this.state.requiredNetwork}
                    />
                  </Form.Input>
                </Form.Group>
                <Form.TextArea
                  rows="15"
                  required
                  label={
                    <div>
                      Interface ABI{' '}
                      <Popup
                        flowing
                        hoverable
                        trigger={<Icon name="question circle" />}
                      >
                        Issues with your Application Binary Interface? Check the
                        proper formatting listed in the{' '}
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://solidity.readthedocs.io/en/latest/abi-spec.html?highlight=abi#handling-tuple-types"
                        >
                          Solidity docs
                        </a>
                        .
                      </Popup>
                    </div>
                  }
                  placeholder={`[{"constant": false,"inputs": [],"name": "distributeFunds", "outputs": [{"name": "","type": "bool"}],"payable": true, "stateMutability": "payable","type": "function"}...]`}
                  value={this.state.abiRaw}
                  onChange={this.handleChangeABI}
                />
                <Message
                  attached="top"
                  error
                  header="Oops!"
                  content={this.state.errorMessage}
                />
                <Navigation direction="right" formSubmit={true} />
              </Form>
            </Segment>
          </Grid>
          <Navigation
            step={currentDappFormStep}
            direction="left"
            onUpdate={state => {
              this.setState({ currentDappFormStep: 1 });
            }}
          />
        </div>
      );
    } else if (currentDappFormStep === 3) {
      formDisplay = (
        <div>
          <Image size="small" centered src={shield} />
          <Header as="h2" textAlign="center">
            Choose your Security
          </Header>
          <Grid stackable columns={2} verticalAlign="bottom" textAlign="center">
            <Grid.Column>
              <Segment>
                <Image centered size="tiny" src={tent} />
                <Header as="h2">
                  Low
                  <Header.Subheader>
                    Unique URL
                    <br />
                    Instant
                    <br />
                    Free
                  </Header.Subheader>
                </Header>
                <Button
                  size="huge"
                  icon="lightning"
                  color="green"
                  onClick={this.handleGenerateDapp}
                  content="Create dApp"
                />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Image centered size="small" src={castle} />
                <Header as="h2">
                  High (coming soon)
                  <Header.Subheader>
                    <Icon name="world" />
                    Custom Ethereum Name Service URL
                    <br />
                    Permanent IPFS storage
                    <br />
                    <Icon name="dollar" />
                    Pay what you want
                  </Header.Subheader>
                </Header>
                <Button
                  disabled
                  size="huge"
                  icon="lock"
                  color="green"
                  onClick={() => this.setState({ currentDappFormStep: 4 })}
                  content="Create dApp"
                />
              </Segment>
            </Grid.Column>
          </Grid>
          <Navigation
            step={currentDappFormStep}
            direction="left"
            onUpdate={state => {
              this.setState({ currentDappFormStep: 2 });
            }}
          />
        </div>
      );
    } else if (currentDappFormStep === 4) {
      const resultRenderer = ({ title }) => [
        <div key={title}>
          <Header>{title}</Header>
        </div>
      ];
      resultRenderer.propTypes = {
        title: PropTypes.string
      };

      formDisplay = (
        <div>
          <Image size="small" centered src={castle} />
          <Header as="h2" textAlign="center">
            Name your castle
          </Header>
          <Form
            error={!!this.state.errorMessage}
            onSubmit={() =>
              this.setState({
                currentDappFormStep: 3
              })
            }
          >
            <Search
              fluid
              // label=".oneclickdapp.eth"
              // labelPosition="right"
              inline
              noResultsMessage="This name is available!"
              loading={this.state.isLoading}
              onSearchChange={_.debounce(this.handleEnsSearchChange, 500, {
                leading: true
              })}
              placeholder="mydApp"
              value={this.state.ensSubnode}
              results={this.state.results}
              resultRenderer={resultRenderer}
              // onResultSelect={this.handleResultSelect}
              required={true}
            />
            <Form.Input
              label="Name your price (ETH)"
              required
              inline
              name="ensFee"
              onChange={this.handleChange}
              value={this.state.ensFee}
            />
            {this.state.results}
            <Message
              attached="top"
              error
              header="Oops!"
              content={this.state.errorMessage}
            />
            <Navigation direction="right" formSubmit={true} />
          </Form>
          <Navigation
            step={currentDappFormStep}
            direction="left"
            onUpdate={state => {
              this.setState({ currentDappFormStep: 2 });
            }}
          />
        </div>
      );
    }

    return (
      <div>
        <Container>
          <Progress
            text="step"
            value={currentDappFormStep}
            total="3"
            progress="ratio"
            color="teal"
            size="medium"
          />
        </Container>
        {formDisplay}
      </div>
    );
  }
  renderInterface() {
    const { requiredNetwork, metaData } = this.state;
    let etherscan = 'https://etherscan.io/';
    if (requiredNetwork) {
      if (
        requiredNetwork[0] === 'Unknown' ||
        requiredNetwork[0] === 'private'
      ) {
        etherscan = 'http://localhost:8000/#/';
      } else if (requiredNetwork[0] === 'POA') {
        etherscan = 'https://blockscout.com/poa/core/';
      } else if (requiredNetwork[0] === 'xDai') {
        etherscan = 'https://blockscout.com/poa/dai/';
      } else if (requiredNetwork[0] !== 'Mainnet') {
        etherscan = 'https://' + requiredNetwork[0] + '.etherscan.io/';
      }
    }
    let displayRegistryData = 'Metadata:  (available only on mainnet)';
    if (metaData) {
      displayRegistryData = (
        <div>
          Metadata:
          <Popup
            hoverable
            flowing
            keepInViewPort
            position="bottom left"
            trigger={
              <Button
                size="tiny"
                onClick={() => {
                  window.open(metaData.data.metadata.url, '_blank');
                }}
              >
                <Image inline size="mini" src={metaData.data.metadata.logo} />
                {metaData.name}
              </Button>
            }
          >
            <Container>
              <Table definition collapsing>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Description</Table.Cell>
                    <Table.Cell>
                      {metaData.data.metadata.description}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Verified</Table.Cell>
                    <Table.Cell>
                      {JSON.stringify(
                        metaData.data.metadata.reputation.verified
                      )}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Status</Table.Cell>
                    <Table.Cell>
                      {metaData.data.metadata.reputation.status}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Category</Table.Cell>
                    <Table.Cell>
                      {metaData.data.metadata.reputation.category}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Self attested</Table.Cell>
                    <Table.Cell>{metaData.self_attested.toString()}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Curated</Table.Cell>
                    <Table.Cell>{metaData.curated.toString()}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Scam info</Table.Cell>
                    <Table.Cell>
                      {JSON.stringify(metaData.data.scamdb)}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              Metadata powered by{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://ethregistry.org/"
              >
                Eth Registry
              </a>
            </Container>
          </Popup>
        </div>
      );
    } else if (this.state.requiredNetwork[0] === 'Mainnet') {
      displayRegistryData = (
        <div>
          Metadata: Nothing found. Add it to{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.oneclickdapp.com/resume-reflex/"
          >
            EthRegistry
          </a>
        </div>
      );
    }

    return (
      <div>
        <Segment textAlign="center">
          <h2>Viewing dApp "{this.state.contractName}"</h2>
          <Grid stackable columns={2}>
            <Grid.Column textAlign="center">
              Network: {this.state.requiredNetwork}
              <br />
              Contract address:{' '}
              <a
                href={`${etherscan}address/${this.state.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.state.contractAddress.substring(0, 7)}...
              </a>
              <br />
              {displayRegistryData}
            </Grid.Column>
            <Grid.Column textAlign="center">
              URL: oneclickdapp.com{this.state.mnemonic || '/ ...'} <br />
              (press{' '}
              {navigator.userAgent.toLowerCase().indexOf('mac') !== -1
                ? 'Command/Cmd'
                : 'CTRL'}{' '}
              + D to Bookmark)
              <TwitterShareButton
                title={
                  '🔨 I just made an instant dApp called "' +
                  this.state.contractName +
                  '." View it at oneclickdapp.com' +
                  this.state.mnemonic
                }
                url={'www.oneclickdapp.com' + this.state.mnemonic}
                hashtags={['oneclickdapp', 'BUIDL']}
              >
                <Button icon primary size="small">
                  <Icon name="twitter" />
                  Tweet this dApp
                </Button>
              </TwitterShareButton>
            </Grid.Column>
          </Grid>
        </Segment>
        <Grid stackable columns={2}>
          <Grid.Column>
            <Header>
              Write{' '}
              <Header.Subheader>(must pay transaction fee)</Header.Subheader>
            </Header>
            {this.renderSends()}
          </Grid.Column>
          <Grid.Column>
            <Header>
              Read
              <Header.Subheader>(free)</Header.Subheader>
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
        <Image centered src={market} size="tiny" />
        <Header textAlign="center" as="h3" icon>
          Recent Public dApps
        </Header>
        <div style={{ overflow: 'auto', maxHeight: 300 }}>
          {recentContracts.length > 0 ? (
            <Table fixed unstackable selectable>
              <Table.Header>
                <Table.Row textAlign="center">
                  <Table.HeaderCell>
                    <Image src={pen} size="mini" centered />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Image src={user} size="mini" centered />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Image src={ethereumSmall} size="mini" centered />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Image src={clock} size="mini" centered />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {recentContracts.map((contract, index) => (
                  <Table.Row
                    textAlign="center"
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
        <Image centered src={treasure} size="small" />
        <Header textAlign="center" as="h3" icon>
          {<Blockie floated config={{ size: 2 }} address={account} /> || (
            <Icon name="user" />
          )}{' '}
          Your saved dApps
        </Header>
        <div style={{ overflow: 'auto', maxHeight: 300 }}>
          {userSavedContracts !== undefined && userSavedContracts.length > 0 ? (
            <Table fixed selectable unstackable>
              <Table.Header>
                <Table.Row textAlign="center">
                  <Table.HeaderCell>
                    <Image src={pen} size="mini" centered />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Image src={ethereumSmall} size="mini" centered />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Image src={clock} size="mini" centered />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {userSavedContracts.map((contract, index) => (
                  <Table.Row
                    textAlign="center"
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
              <br />
              (Check that MetaMask is unlocked)
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
                  required
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
            // If it is payable, then make a form
            if (method.payable) {
              // console.log(`   Inputs: (payable)`);
              methodTypeHelperText = 'payable function';
              formInputs.push(
                <Form.Input
                  required
                  key={method.name + i}
                  inputindex={-1}
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
            // console.log(i + ' ' + method.name);
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
      account,
      gwei,
      block,
      avgBlockTime,
      etherscan,
      requiredNetwork,
      displayDappForm,
      displayLoading,
      enableDapparatus
    } = this.state;
    let connectedDisplay = [];
    if (web3 && !displayDappForm) {
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
      //   <ContractLoaderCustom
      //     key="Contract Loader Custom"
      //     config={{ hide: false }}
      //     web3={this.state.web3}
      //     onReady={contracts => {
      //       console.log('contracts loaded', contracts);
      //       this.setState({ contracts: contracts });
      //     }}
      //     address={contractAddress}
      //     abi={this.state.abiRaw}
      //     contractName={contractName}
      //   />
      // );
      // connectedDisplay.push(
      //   <ContractLoader
      //     key="Contract Loader"
      //     config={{ hide: false }}
      //     web3={this.state.web3}
      //     require={path => {
      //       return require(`${__dirname}/${path}`);
      //     }}
      //     onReady={contracts => {
      //       console.log('contracts loaded', contracts);
      //       this.setState({ contracts: contracts });
      //     }}
      //   />
      // );
      // if (contracts) {
      //   connectedDisplay.push(
      //     <Events
      //       key="Events"
      //       config={{ hide: false, debug: true }}
      //       contract={contracts.splitter}
      //       eventName={'Create'}
      //       block={block}
      //       id={'_id'}
      //       filter={{ _owner: account }}
      //       onUpdate={(eventData, allEvents) => {
      //         console.log('EVENT DATA:', eventData);
      //         this.setState({ events: allEvents });
      //       }}
      //     />
      //   );
      // }
      connectedDisplay.push(
        <TransactionsCustom
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
    let dapparatus;
    if (enableDapparatus) {
      dapparatus = (
        <Dapparatus
          config={{
            DEBUG: false,
            requiredNetwork: requiredNetwork,
            metatxAccountGenerator: false,
            hide: displayDappForm,
            boxStyle: {
              paddingTop: 8
            },
            textStyle: {
              color: '#e5e5e5'
            },
            warningStyle: {
              fontSize: 20,
              color: '#d31717'
            }
          }}
          metatx={METATX}
          fallbackWeb3Provider={new Web3.providers.HttpProvider(WEB3_PROVIDER)}
          onUpdate={state => {
            console.log('dapparatus state update:', state);
            if (state.web3Provider) {
              state.web3 = new Web3(state.web3Provider);
              this.setState(state);
            }
          }}
        />
      );
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
        <Menu size="huge" inverted fixed="top">
          <Container>
            <Menu.Item>One Click dApp</Menu.Item>
            <Menu.Item as="a" href="http://oneclickdapp.com">
              <Icon name="plus" /> New
            </Menu.Item>
            <Menu.Item>
              <Dropdown simple text="About">
                <Dropdown.Menu>
                  <Dropdown.Item
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/blockchainbuddha/one-click-DApps"
                    image={github}
                    text="Github"
                  />
                  <Dropdown.Item
                    image={twitter}
                    href="https://twitter.com/pi0neerpat"
                    target="_blank"
                    rel="noopener noreferrer"
                    text="twitter"
                  />
                  <Popup
                    flowing
                    hoverable
                    trigger={<Dropdown.Item text="Help" image={question} />}
                  >
                    Need help? Use the chat in the bottom right corner.
                  </Popup>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
            <Menu.Menu position="right">{dapparatus}</Menu.Menu>
          </Container>
        </Menu>

        <Container style={{ marginTop: '5em' }}>
          {mainDisplay}
          {connectedDisplay}
        </Container>
      </div>
    );
  }
}

export default App;
