import React, { Component } from 'react';
import './App.css';
import {
  Grid,
  Message,
  Input,
  Form,
  Menu,
  Segment,
  Header,
  Divider,
  Icon,
  Button,
  Progress,
  Popup,
  Container,
  Modal,
  Table,
  Image,
  List,
  Search,
  Responsive,
  Visibility,
  Accordion,
  Card,
  Reveal,
  Sidebar,
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
// import ContractLoaderCustom from './components/ContractLoaderCustom';
import TransactionsCustom from './components/transactionsCustom';
import Navigation from './components/Navigation';
import Web3 from 'web3';
import web3 from './ethereum/web3';
import moment from 'moment';
import _ from 'lodash';
// import sampleABI from './ethereum/sampleABI1'; // ABI for test purposes
import PropTypes from 'prop-types';
import { TwitterShareButton } from 'react-share';
const axios = require('axios');
// Dapparatus
const METATX = {
  endpoint: 'http://0.0.0.0:1001/',
  contract: '0xf5bf6541843D2ba2865e9aeC153F28aaD96F6fbc'
  // accountGenerator: '//account.metatx.io'
};
const WEB3_PROVIDER = 'https://ropsten.infura.io/UkZfSHYlZUsRnBPYPjTO';
// image assets
// const chelseaHello = require('./assets/chelsea-hello.png');
const tablet = require('./assets/tablet.png');
const castle = require('./assets/castle.png');
const shield = require('./assets/shield.png');
const tent = require('./assets/tent.png');
const twitter = require('./assets/twitter.png');
const details = require('./assets/details.png');
const chiselProcess = require('./assets/chisel-process.png');
const market = require('./assets/market.png');
const treasure = require('./assets/treasure.png');
const clone = require('./assets/copy.png');
const pen = require('./assets/pen.png');
const user = require('./assets/user.png');
const ethereum = require('./assets/ethereum.png');
const clock = require('./assets/clock.png');
const github = require(`./assets/github.png`);
const question = require(`./assets/question.png`);
const backgroundImage = require(`./assets/backgroundImage.png`);
const share = require(`./assets/share.png`);
const deployment = require(`./assets/deployment.png`);
const exampleBeauty = require(`./assets/exampleBeauty.png`);
const exampleMobile = require(`./assets/exampleMobile.png`);
const ensipfs = require(`./assets/ensipfs.png`);
const chelsea = require(`./assets/chelsea.png`);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      abi: '',
      abiRaw: '',
      network: '',
      requiredNetwork: '',
      contractAddress: '',
      getDappData: '',
      errorMessage: false,
      loading: false,
      methodData: [],
      mnemonic: '',
      metaData: {},
      dappData: false,
      recentContracts: {},
      userSavedContracts: {},
      externalContracts: [],
      userHasBeenLoaded: false,
      activeIndex: [],
      activeItem: 'write',
      // ENS
      ensSubnode: 'myDapp2',
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
      doingTransaction: false,
      customLoader: false
    };
  }
  componentDidMount = async () => {
    if (!this.getDappData()) {
      this.getRecentPublicContracts();
      this.getExternalContracts();
      this.getExistingSubnodes();
    }
  };
  componentDidUpdate() {
    if (
      !this.state.userHasBeenLoaded &&
      this.state.account &&
      this.state.displayDappForm
    ) {
      this.getUserSavedContracts();
    }
  }

  getDappData = () => {
    const mnemonic = window.location.pathname;
    if (mnemonic === '/new' || mnemonic === '/new/') {
      this.getRecentPublicContracts();
      this.getExternalContracts();
      this.getExistingSubnodes();
      this.setState({ currentDappFormStep: 1, enableDapparatus: true });
      return true;
    }
    if (mnemonic.length > 1) {
      this.showLoading('downloading');
      this.setState({
        requestAccessMetamask: true
      });
      axios
        .get(`/contracts${mnemonic}`)
        .then(result => {
          // console.log(result);
          this.handleChangeABI(
            {},
            { value: JSON.stringify(result.data.abi) || '' }
          );
          document.title = `oneclickdapp: ${result.data.contractName}`;
          this.setState({
            requiredNetwork: [result.data.network] || '',
            network: [result.data.network] || '',
            dappName: result.data.contractName || '',
            contractAddress: result.data.contractAddress || '',
            metaData: result.data.metaData || '',
            premiumDappData: result.data.premiumDapp || false,
            mnemonic: mnemonic,
            displayDappForm: false,
            displayLoading: false,
            enableDapparatus: true,
            dappData: {
              premium: result.data.premium || false,
              dappName: result.data.contractName || '',
              description: result.data.description || '',
              mnemonic: mnemonic,
              contactInfo: result.data.contactInfo || '',
              colorLight: result.data.colorLight || '',
              colorDark: result.data.colorDark || '',
              instructions: result.data.instructions || '',
              network: [result.data.network] || [],
              contractAddress: result.data.contractAddress || '',
              metaData: result.data.metaData || '',
              functions: result.data.functions || '',
              favicon: result.data.favicon || '',
              icon: result.data.icon || '',
              backgroundImage: result.data.backgroundImage
            }
          });
        })
        .catch(e => {
          console.log(`Could not find a dApp for ${mnemonic}`);
          this.showLoading('not found');
        });
      return true;
    } else {
      return false;
      // this.handleChangeABI({}, { value: this.state.abiRaw });
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
        console.log(response);
        if (response.data) {
          this.setState({
            userSavedContracts: response.data,
            userHasBeenLoaded: true
          });
        } else console.log(response);
      })
      .catch(err => {
        this.setState({
          userHasBeenLoaded: true
        });
        console.log(
          'getUserSavedContracts: User not found or no saved contracts exist'
        );
      });
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

  generateDapp = () => {
    const { dappName, contractAddress, abiRaw, network, account } = this.state;
    this.showLoading('creating');
    const abi = JSON.parse(abiRaw);
    console.log('Generating unique URL...' + account);
    axios
      .post(`/contracts`, {
        contractName: dappName,
        contractAddress,
        abi,
        network: network,
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
  generateSecureDapp = async () => {
    // const {
    //   dappName,
    //   contractAddress,
    //   abiRaw,
    //   network,
    //   account,
    //   ensSubnode,
    //   ensFee,
    //   ensRegistryABI,
    //   ensRegistryAddress
    // } = this.state;
    // const displayLoading = (
    //   <div>
    //     <Icon.Group size="huge">
    //       <Icon loading size="large" name="circle notch" />
    //       <Icon name="code" />
    //     </Icon.Group>
    //     <Header as="h2">
    //       Registering "{ensSubnode}.oneclickdapp.eth"
    //       <br />
    //       Uploading raw HTML to IPFS
    //       <br />
    //       Updating resolver to IPFS content hash
    //       <Header.Subheader>This can take up to 30 seconds...</Header.Subheader>
    //     </Header>
    //     <Message
    //       attached="top"
    //       error
    //       header="Oops!"
    //       hide={!this.state.errorMessage}
    //       content={this.state.errorMessage}
    //     />
    //     <Image centered src={chiselProcess} size="huge" />
    //   </div>
    // );
    // this.setState({
    //   displayLoading
    // });
    // console.log('Generating secure dApp...');
    //
    // // 1. Register ENS subnode
    // if (ensRegistryABI && typeof window.web3 !== "undefined") {
    //     var ens = new ENS(window.web3.currentProvider);
    //     ens.setSubnodeOwner(`${ensSubnode}.interface.eth`, account)
    //       // 2. Compile and upload raw HTML to IPFS
    //       const ipfsHash="success"
    //
    //       // 3. Update resolver with IPFS content hash
    //       // Generate the node byte32
    //       var node = '0x0000000000000000000000000000000000000000000000000000000000000000';
    //       if (ensSubnode !== '') {
    //           var labels =`${ensSubnode}.interface.eth`.split(".");
    //           for(var i = labels.length - 1; i >= 0; i--) {
    //               node = web3.sha3(node + web3.sha3(labels[i]).slice(2), {encoding: 'hex'});
    //           }
    //       }
    //       const resultNode = node.toString()
    //       // Modify content hash according to EIP 1557
    //
    //       // Submit to Public Resolver
    //       const publicResolver = new web3.eth.Contract(
    //         publicResolverABI,
    //         publicResolverAddress
    //       );
    //       try {
    //         await publicResolver.methods.setContenthash(resultNode, ipfsHash).send({
    //           from: account
    //         });
    //       } catch (err) {
    //         this.setState({ errorMessage: err.message });
    //       }
    //
    //   } else {
    //     console.log("errror metamask is not running");
    //   }
    //
    // }
  };
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };
  handleInput(e) {
    let update = {};
    update[e.target.name] = e.target.value;
    this.setState(update);
  }
  handleToggleAccordian = (e, titleProps) => {
    // Manages which premium feature is active
    const { index } = titleProps;
    const { activeIndex } = this.state;
    let newIndex = activeIndex;
    if (activeIndex && activeIndex.includes(index)) {
      newIndex.splice(activeIndex.indexOf(index), 1);
    } else newIndex.push(index);
    this.setState({ activeIndex: newIndex });
  };
  handleMenuTabChange = (e, { name }) =>
    this.setState({ activeItem: name, activeIndex: [] });
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
                  abiObject[i].outputs[j].name = 'unnamed #' + (j + 1);
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
  handleMethodDataChange = (e, { name, value, inputindex, payable }) => {
    // Takes inputs from the user and stores them to JSON object methodArguments
    let newMethodData = this.state.methodData;
    const methodIndex = newMethodData.findIndex(method => method.name === name);
    if (inputindex === -1) {
      newMethodData[methodIndex].value = value;
    } else {
      newMethodData[methodIndex].inputs[inputindex] = value;
    }
    this.setState({ methodData: newMethodData, errorMessage: false });
    // console.log(JSON.stringify(this.state.methodData));
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
  handleResultSelect = (e, { result }) => {
    const name = `${result.title} (clone)`;
    this.setState({
      dappName: name,
      requiredNetwork: 'Mainnet',
      contractAddress: result.address,
      abiRaw: JSON.stringify(result.abi),
      currentDappFormStep: 2
    });
  }; // dAppForm search bar
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, dappName: value });
    setTimeout(() => {
      if (value.length < 1) return this.resetComponent();
      const re = new RegExp(_.escapeRegExp(value), 'i');
      const isMatch = result => re.test(result.title);
      this.setState({
        isLoading: false,
        results: _.filter(this.state.externalContracts, isMatch)
      });
    }, 300);
  }; // dAppForm search bar
  handleEnsSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, ensSubnode: value });
    setTimeout(() => {
      if (value.length < 1) return this.resetComponent();
      const isExactMatch = result => {
        return value === result.title;
      };
      this.setState({
        isLoading: false,
        results: _.filter(this.state.existingSubnodes, isExactMatch)
      });
    }, 300);
  }; // dAppForm ENS selection
  resetComponent = () =>
    this.setState({ isLoading: false, results: [], dappName: '' }); // dAppForm search bar/ENS selection
  handleSubmitSend = (e, { name }) => {
    const { methodData, abi, contractAddress, account } = this.state;
    // send() methods alter the contract state, and require gas.
    console.log("Performing function 'send()'...");
    this.setState({ errorMessage: '' });
    let newMethodData = methodData;
    const methodIndex = methodData.findIndex(method => method.name === name);

    // note: only gets first method. There could be more!
    // TODO fix this ^
    const method = methodData.find(method => method.name === name);
    if (!method) {
      this.setState({ errorMessage: 'You must enter some values' });
    } else {
      console.log('method submitted' + JSON.stringify(method));
      // Generate the contract object
      // TODO instead use the contract instance created during submitDapp()
      try {
        const myContract = new web3.eth.Contract(
          JSON.parse(abi),
          contractAddress
        );
        myContract.methods[method.name](...method.inputs)
          .send({
            from: account,
            value: web3.utils.toWei(method.value || '0', 'ether')
          })
          .then(response => {
            console.log('pass bool check' + typeof response);
            if (typeof response === 'boolean') {
              newMethodData[methodIndex].outputs[0] = response.toString();
            } else if (typeof response === 'object') {
              Object.entries(response).forEach(([key, value]) => {
                newMethodData[methodIndex].outputs[key] = value.toString();
              });
            } else newMethodData[methodIndex].outputs[0] = response;
            this.setState({ methodData: newMethodData });
          })
          .catch(err => {
            this.setState({ errorMessage: err.message });
          });
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }
    }
  };
  handleSubmitCall = (e, { name }) => {
    // call() methods do not alter the contract state. No gas needed.
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
    try {
      const myContract = new web3.eth.Contract(
        JSON.parse(abi),
        contractAddress
      );
      // using "..." to destructure inputs[]
      myContract.methods[name](...inputs)
        .call({
          from: this.state.account
        })
        .then(response => {
          if (typeof response === 'boolean') {
            newMethodData[methodIndex].outputs[0] = response.toString();
          } else if (typeof response === 'object') {
            Object.entries(response).forEach(([key, value]) => {
              newMethodData[methodIndex].outputs[key] = value.toString();
            });
          } else newMethodData[methodIndex].outputs[0] = response;
          this.setState({ methodData: newMethodData });
        })
        .catch(err => {
          this.setState({ errorMessage: err.message });
        });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };
  handleCreateNewDapp = () => {
    this.setState({
      currentDappFormStep: 1,
      enableDapparatus: true
    });
    window.scrollTo(0, 0);
  };
  handleSubmitEmail = () => {
    axios
      .post(`/emails`, {
        email: this.state.email
      })
      .then(
        this.setState({
          emailSubmitted: true
        })
      )
      .catch(err => {
        console.log(err);
      });
  };

  showErrorMessage = type => {
    let message = <div />;
    if (this.state.errorMessage) {
      if (type === 'popup') {
        message = (
          <div
            style={{
              position: 'fixed',
              zIndex: 10,
              top: 60,
              left: 60,
              paddingRight: 60,
              textAlign: 'left'
            }}
          >
            <Message
              style={{ zIndex: 12 }}
              size="large"
              error
              onDismiss={() => this.setState({ errorMessage: false })}
              header="Error:"
              content={this.state.errorMessage}
            />
          </div>
        );
      } else {
        message = (
          <Message
            style={{ zIndex: 12 }}
            attached="top"
            error
            header="Oops!"
            content={this.state.errorMessage}
          />
        );
      }
    }
    return message;
  };
  showLoading = action => {
    let loading = false;
    if (action === 'downloading') {
      loading = (
        <div className="loadingDIV">
          <Icon.Group size="huge">
            <Icon loading size="large" name="circle notch" />
            <Icon name="download" />
          </Icon.Group>
          <Header as="h2">Loading...</Header>
          <Image centered src={tablet} />
        </div>
      );
    } else if (action === 'creating') {
      loading = (
        <div className="loadingDIV">
          <Icon.Group size="huge">
            <Icon loading size="large" name="circle notch" />
            <Icon name="code" />
          </Icon.Group>
          <Header as="h2">Building your dApp...</Header>
          <Image centered src={chiselProcess} size="huge" />
        </div>
      );
    } else if (action === 'not found') {
      loading = (
        <div className="dAppNotFound">
          <Container>
            <Grid stackable columns={2}>
              <Grid.Column>
                <Icon size="huge" name="ban" />
                <Header as="h2">Sorry, I couldn't find this dApp.</Header>
                <br />
                <br />
                <br />
                <Button
                  color="green"
                  size="huge"
                  icon="plus"
                  content="Create a new dApp"
                  as="a"
                  href="http://oneclickdapp.com/new"
                />
              </Grid.Column>
              <Grid.Column>
                <Image centered src={chelsea} size="small" />
              </Grid.Column>
            </Grid>
          </Container>
        </div>
      );
    }
    this.setState({ displayLoading: loading });
  };

  renderFooter() {
    const { dappData } = this.state;
    let displayContactInfo;
    if (dappData && dappData.premium) {
      displayContactInfo = (
        <Grid.Column width={3}>
          <Header inverted as="h4" content={dappData.contactInfo.company} />
          <List link inverted>
            <List.Item
              as="a"
              href={dappData.contactInfo.website}
              target="_blank"
            >
              Website
            </List.Item>
            {dappData.contactInfo.email ? (
              <List.Item
                as="a"
                href={`mailto:${
                  dappData.contactInfo.email
                }?subject=Question%20about%20"${
                  dappData.dappName
                }"%20via%20OneClickDapp.com`}
                target="_self"
              >
                Contact
              </List.Item>
            ) : (
              <div />
            )}
          </List>
        </Grid.Column>
      );
    }
    return (
      <div className="footer">
        <Grid divided stackable textAlign="left">
          <Grid.Row>
            {displayContactInfo}
            <Grid.Column width={3}>
              <h4>One Click dApp</h4>
              <List link>
                <List.Item
                  style={{ color: 'white' }}
                  as="a"
                  href="mailto:blockchainbuddha@gmail.com?subject=Question%20about%20OneClickdApp.com"
                  target="_self"
                >
                  Contact Us
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <h4>Create a dApp in seconds</h4>
              <p>
                Turn your smart contract into a custom dApp in seconds, without
                writing a single line of code.
              </p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>Copyright 2018 OneClickdApp</Grid.Row>
        </Grid>
      </div>
    );
  }
  renderDappForm() {
    const { currentDappFormStep } = this.state;
    const errorMessage = this.showErrorMessage();
    let formDisplay = [];

    if (currentDappFormStep < 1) {
      formDisplay = (
        <div>
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <div className="homePageHeader">
              <Grid stackable columns={2} verticalAlign="middle">
                <Grid.Column textAlign="left">
                  <p style={{ fontSize: '4em' }}>Instant, Simple, Secure.</p>
                  <p style={{ fontSize: '1.5em', width: '90%' }}>
                    Turn your smart contract into a customizable, easy-to-use
                    dApp.
                  </p>
                  <Divider hidden />
                  <Grid.Column>
                    <Button
                      primary
                      size="huge"
                      content="Create a dApp for free"
                      onClick={this.handleCreateNewDapp}
                    />
                  </Grid.Column>
                </Grid.Column>
                <Grid.Column>
                  <Image src={tablet} />
                </Grid.Column>
              </Grid>
            </div>
          </Responsive>
          <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
            <div className="homePageHeaderMobile">
              <p style={{ fontSize: '3em' }}>Instant, Simple, Secure.</p>
              <p style={{ fontSize: '1.5em' }}>
                Turn your smart contract into a customizable, easy-to-use dApp.
              </p>
              <Image centered src={tablet} size="small" />
              <br />
              <br />
              <Button
                primary
                size="huge"
                content="Create a dApp for free"
                onClick={() => {
                  this.setState({
                    currentDappFormStep: 1,
                    enableDapparatus: true
                  });
                }}
              />
              <p>(mobile-friendly)</p>
            </div>
          </Responsive>
          <div className="homePageContent">
            <Grid container columns={3} stackable>
              <Grid.Row verticalAlign="middle">
                <Grid.Column>
                  <Image centered size="medium" src={deployment} />
                  <h1>1. Deploy</h1>
                  <br />
                  <h3>
                    Deploy your smart contract to any network using{' '}
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
                      Truffle
                    </a>
                    .
                  </h3>
                </Grid.Column>
                <Grid.Column>
                  <Image centered size="small" src={details} />
                  <h1>2. Choose</h1>
                  <br />
                  <h3>
                    Enter your ABI, network, and select your customizations.
                  </h3>
                </Grid.Column>
                <Grid.Column textAlign="center">
                  <Image centered size="small" src={share} />
                  <h2>
                    oneclickdapp.com/<i>{'<your-dapp>'}</i>
                  </h2>
                  <h1>3. Use</h1>
                  <br />
                  <h3>Use and share your dApp at a custom URL.</h3>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
          <div className="homePageContentWhite">
            <Container>
              <Grid stackable columns={2}>
                <Grid.Row textAlign="left" verticalAlign="middle">
                  <Grid.Column>
                    <h1>Clean and simple interface.</h1>
                    <h3>
                      Customize the look of your dApp and choose which functions
                      to display. Guide your users through each function with
                      helpful icons and instructions.
                    </h3>
                  </Grid.Column>
                  <Grid.Column>
                    <Image src={exampleBeauty} />
                  </Grid.Column>
                </Grid.Row>
                <Divider />
                <Grid.Row textAlign="left" verticalAlign="middle">
                  <Grid.Column>
                    <Image src={exampleMobile} size="large" />
                  </Grid.Column>
                  <Grid.Column>
                    <h1>Desktop and mobile-ready.</h1>
                    <h3>
                      Access your dApp on any device, and use your favorite
                      ethereum wallet to sign transactions.
                    </h3>
                  </Grid.Column>
                </Grid.Row>
                <Divider />
                <Grid.Row textAlign="left" verticalAlign="middle">
                  <Grid.Column>
                    <h1>Secured with ENS and IPFS.</h1>
                    <h3>
                      Each dApp is protected using a unique ENS subdomain linked
                      to your IPFS data. Are you a cypher-punk or
                      crypto-anarchist who
                      <i>rejects centralization whenever possible</i>? We salute
                      you! Your dApp can be accessed directly from your own IPFS
                      node to avoid DNS and other intermediaries altogether.
                    </h3>
                  </Grid.Column>
                  <Grid.Column>
                    <Image src={ensipfs} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          </div>
          <div className="homePageContent">
            <h1>No token. No credit cards. No bullshit.</h1>
            <h3>Subscribe using DAI stable-coin</h3>
            <br />
            <Grid
              container
              columns={2}
              stackable
              divided
              verticalAlign="top"
              textAlign="center"
            >
              <Grid.Column>
                <h1>Free</h1>
                <Image centered size="small" src={tent} />
                <h3>
                  <Icon name="linkify" />
                  Unique URL
                  <br />
                  <Icon name="clock" />
                  30s or less
                  <br />
                  Noob-friendly
                </h3>
                <Button
                  size="huge"
                  icon="lightning"
                  color="green"
                  onClick={this.handleCreateNewDapp}
                  content="Create dApp"
                />
              </Grid.Column>

              <Grid.Column>
                <h1>Premium ($5/month)</h1>
                <Image centered size="small" src={castle} />
                <h3>
                  <Icon name="paint brush" />
                  Customizable
                  <br />
                  <Icon name="cloud" />
                  ENS + IPFS hosted
                  <br />
                  <Icon name="dashboard" />
                  Usage data
                </h3>
                <Modal
                  centered
                  size="small"
                  dimmer="inverted"
                  closeIcon
                  trigger={
                    <Button
                      icon="send"
                      content="Contact us"
                      size="huge"
                      color="blue"
                    />
                  }
                >
                  <Modal.Header>
                    Submit your email and we'll contact you
                  </Modal.Header>
                  <Modal.Content>
                    <Modal.Description>
                      <Form
                        success={this.state.emailSubmitted}
                        onSubmit={this.handleSubmitEmail}
                      >
                        <Form.Input
                          inline
                          name="email"
                          label="email"
                          onChange={this.handleChange}
                        />
                        <Message
                          success
                          header="Excellent!"
                          content="You're all signed up"
                        />
                        <Button content="submit" secondary />
                      </Form>
                    </Modal.Description>
                  </Modal.Content>
                </Modal>
                <br />
                <a
                  href="http://oneclickdapp.com/cryptokitties"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See an example
                </a>
              </Grid.Column>
            </Grid>
          </div>
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
        <Container>
          <Container className="progressBar">
            <Progress
              value={0}
              total="3"
              progress="ratio"
              color="teal"
              size="medium"
            />
          </Container>
          <div className="dappForm">
            <Image src={pen} size="small" centered />
            <Header as="h2">
              Create a new dApp
              <Header.Subheader>
                or clone an existing one{' '}
                <Image src={clone} size="mini" inline />
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
                value={this.state.dappName}
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
                <div className="dappFormOption">{this.renderUserHistory()}</div>
              </Grid.Column>
              <Grid.Column>
                <div className="dappFormOption">
                  {this.renderGlobalHistory()}
                </div>
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
        </Container>
      );
    } else if (currentDappFormStep === 2) {
      formDisplay = (
        <Container>
          <Container className="progressBar">
            <Progress
              value={1}
              total="3"
              progress="ratio"
              color="teal"
              size="medium"
            />
          </Container>
          <div className="dappForm">
            <Image centered size="small" src={details} />
            <Header as="h2" textAlign="center">
              Enter details for "{this.state.dappName}"
            </Header>
            <Grid textAlign="center">
              <div className="dappFormOption">
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
                  {errorMessage}
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
                          Issues with your Application Binary Interface? Check
                          the proper formatting listed in the{' '}
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
                  <Navigation direction="right" formSubmit={true} />
                </Form>
              </div>
            </Grid>
            <Navigation
              step={currentDappFormStep}
              direction="left"
              onUpdate={state => {
                this.setState({ currentDappFormStep: 1 });
              }}
            />
          </div>
        </Container>
      );
    } else if (currentDappFormStep === 3) {
      formDisplay = (
        <Container>
          <Container className="progressBar">
            <Progress
              value={2}
              total="3"
              progress="ratio"
              color="teal"
              size="medium"
            />
          </Container>
          <div className="dappForm">
            <Image size="small" centered src={shield} />
            <Header as="h2" textAlign="center">
              Fortify your dApp
            </Header>
            <div className="dappFormOption">
              <Grid
                container
                columns={2}
                stackable
                verticalAlign="top"
                textAlign="center"
              >
                <Grid.Row>
                  <Grid.Column>
                    <h1>Free</h1>
                    <Image centered size="small" src={tent} />
                    <h3>
                      <Icon name="linkify" />
                      Unique URL
                      <br />
                      <Icon name="clock" />
                      30s or less
                      <br />
                      Noob-friendly
                    </h3>
                    <Button
                      size="huge"
                      icon="lightning"
                      color="green"
                      onClick={this.generateDapp}
                      content="Create dApp"
                    />
                  </Grid.Column>
                  <Divider vertical>OR</Divider>
                  <Grid.Column>
                    <h1>Premium ($5/month)</h1>
                    <Image centered size="small" src={castle} />
                    <h3>
                      <Icon name="paint brush" />
                      Customizable
                      <br />
                      <Icon name="cloud" />
                      ENS + IPFS hosted
                      <br />
                      <Icon name="dashboard" />
                      Usage data
                    </h3>
                    <Modal
                      centered
                      size="small"
                      dimmer="inverted"
                      closeIcon
                      trigger={
                        <Button
                          icon="send"
                          content="Contact us"
                          size="huge"
                          color="blue"
                        />
                      }
                    >
                      <Modal.Header>
                        Submit your email and we'll contact you
                      </Modal.Header>
                      <Modal.Content>
                        <Modal.Description>
                          <Form
                            success={this.state.emailSubmitted}
                            onSubmit={this.handleSubmitEmail}
                          >
                            <Form.Input
                              inline
                              name="email"
                              label="email"
                              onChange={this.handleChange}
                            />
                            <Message
                              success
                              header="Excellent!"
                              content="You're all signed up"
                            />
                            <Button content="submit" secondary />
                          </Form>
                        </Modal.Description>
                      </Modal.Content>
                    </Modal>
                    <br />
                    <a
                      href="http://oneclickdapp.com/cryptokitties"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      See an example
                    </a>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </div>
        </Container>
      );
    } else if (currentDappFormStep === 4) {
      const resultRenderer = ({ title }) => [
        <div key={title}>
          <Header>{title} is not available</Header>
        </div>
      ];
      resultRenderer.propTypes = {
        title: PropTypes.string
      };

      formDisplay = (
        <Container>
          <Container className="progressBar">
            <Progress
              value={3}
              total="3"
              progress="ratio"
              color="teal"
              size="medium"
            />
          </Container>
          <div className="dappForm">
            <Image size="small" centered src={tablet} />
            <Header as="h2" textAlign="center">
              Create a Secure & Permanent dApp
            </Header>
            <Form
              error={!!this.state.errorMessage}
              onSubmit={() => this.generateSecureDapp()}
            >
              <Search
                fluid
                noResultsMessage="This name is available!"
                loading={this.state.isLoading}
                onSearchChange={_.debounce(this.handleEnsSearchChange, 500, {
                  leading: true
                })}
                placeholder="mydApp"
                value={this.state.ensSubnode}
                results={this.state.results}
                resultRenderer={resultRenderer}
                required={true}
              />
              .oneclickdapp.eth
              <Form.Input
                label="Name your price (ETH)"
                required
                units="eth"
                inline
                name="ensFee"
                onChange={this.handleChange}
                value={this.state.ensFee}
              />
              <Message
                attached="top"
                error
                header="Oops!"
                content={this.state.errorMessage}
              />
              <Button size="huge" content="Create dApp" color="green" />
            </Form>
            <Navigation
              step={currentDappFormStep}
              direction="left"
              onUpdate={state => {
                this.setState({ currentDappFormStep: 3 });
              }}
            />
          </div>
        </Container>
      );
    }

    return <div>{formDisplay}</div>;
  }
  renderGlobalHistory() {
    const { recentContracts } = this.state;
    return (
      <div>
        <Image centered src={market} size="small" />
        <Header textAlign="center" as="h3" icon>
          Recent Public dApps
        </Header>
        <div className="dappList">
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
                    <Image src={ethereum} size="mini" centered />
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
        <div className="dappList">
          {userSavedContracts !== undefined && userSavedContracts.length > 0 ? (
            <Table fixed selectable unstackable>
              <Table.Header>
                <Table.Row textAlign="center">
                  <Table.HeaderCell>
                    <Image src={pen} size="mini" centered />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Image src={ethereum} size="mini" centered />
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
  // Old interface
  renderSendFunctions() {
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
  renderCallFunctions() {
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
                  required
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
                <Container key={j}>
                  {output.name || '(unnamed)'} <i>{output.type}</i>:
                  <b>{outputData || ''}</b>
                </Container>
              );
            });
            forms.push(
              <Segment
                textAlign="left"
                key={i}
                // style={{ position: 'absolute' }}
              >
                <Form
                  onSubmit={this.handleSubmitCall}
                  name={method.name}
                  key={i}
                >
                  <Header textAlign="center">
                    {method.name}
                    <Header.Subheader>View</Header.Subheader>
                  </Header>
                  <Button
                    style={{ position: 'absolute', top: 10, left: 5 }}
                    icon="refresh"
                  />
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
  renderOldInterface() {
    const errorMessage = this.showErrorMessage('popup');
    return (
      <div>
        <Container
          style={{
            paddingTop: '2em',
            paddingBottom: '5em'
          }}
        >
          <Grid stackable columns={2}>
            <Grid.Column>
              <Header>
                Write functions
                <Header.Subheader>(must pay transaction fee)</Header.Subheader>
              </Header>
              {this.renderSendFunctions()}
            </Grid.Column>
            <Grid.Column>
              <Header>
                Read functions
                <Header.Subheader>(free)</Header.Subheader>
              </Header>
              {this.renderCallFunctions()}
            </Grid.Column>
          </Grid>
        </Container>
        {errorMessage}
      </div>
    );
  }
  // New Interface
  renderNewInterface() {
    const { dappData, activeIndex } = this.state;
    const errorMessage = this.showErrorMessage('popup');
    let displayFunctions = [];
    // If premium, then do this
    if (dappData.premium && dappData.functions) {
      dappData.functions.forEach((item, index) => {
        displayFunctions.push(
          <Accordion
            as={Card}
            link
            raised
            centered
            key={index}
            className="function"
            style={{ background: dappData.colorLight }}
          >
            <Card.Content textAlign="left">
              <Accordion.Title
                active={activeIndex.includes(index)}
                index={index}
                onClick={this.handleToggleAccordian}
              >
                <Grid columns={2} verticalAlign="middle">
                  <Grid.Column>
                    <Icon
                      size="huge"
                      circular
                      name={item.icon}
                      style={{
                        background: dappData.colorDark,
                        color: 'white'
                        // color: dappData.colorLight
                      }}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Header>{item.displayName}</Header>
                  </Grid.Column>
                </Grid>
              </Accordion.Title>
              <Accordion.Content active={activeIndex.includes(index)}>
                {this.renderPremiumFunctions(
                  item.methodIndex,
                  true,
                  item.helperText,
                  dappData.colorDark
                )}
              </Accordion.Content>
            </Card.Content>
          </Accordion>
        );
      });
      displayFunctions = <Card.Group>{displayFunctions}</Card.Group>;
    }
    // If not premium, then do This
    else {
      let showFunctions;
      if (this.state.activeItem === 'read') {
        showFunctions = this.renderNewCallFunctions();
      } else if (this.state.activeItem === 'write') {
        showFunctions = this.renderNewSendFunctions();
      } else if (this.state.activeItem === 'search') {
        // this.renderFunctionResults()
      }

      displayFunctions = (
        <div>
          <Menu tabular size="huge" attached="top">
            <Menu.Item
              color="red"
              icon="pencil"
              name="write"
              active={this.state.activeItem === 'write'}
              onClick={this.handleMenuTabChange}
            />
            <Menu.Item
              color="green"
              icon="eye"
              name="read"
              active={this.state.activeItem === 'read'}
              onClick={this.handleMenuTabChange}
            />
          </Menu>
          <Segment attached="bottom">
            <Card.Group>{showFunctions}</Card.Group>
          </Segment>
        </div>
      );
    }
    return (
      <div
        style={{
          paddingTop: '3em',
          paddingBottom: '5em'
        }}
      >
        <Container>{displayFunctions}</Container>
        {errorMessage}
      </div>
    );
  }
  renderNewSendFunctions() {
    const abiObject = JSON.parse(this.state.abi);
    let displayFunctions = [];
    abiObject.forEach((method, index) => {
      if (method.stateMutability !== 'view' && method.type === 'function')
        displayFunctions.push(
          <Accordion
            as={Card}
            link
            raised
            centered
            key={index}
            className="function"
            // style={{ background: dappData.colorLight }}
          >
            <Card.Content textAlign="left">
              <Accordion.Title
                active={this.state.activeIndex.includes(index)}
                index={index}
                onClick={this.handleToggleAccordian}
              >
                <Grid columns="equal" verticalAlign="middle">
                  <Grid.Column width={3}>
                    <Icon size="large" circular name="pencil" />
                  </Grid.Column>
                  <Grid.Column fluid>
                    <Header style={{ wordWrap: 'break-word' }}>
                      {method.name}
                    </Header>
                  </Grid.Column>
                </Grid>
              </Accordion.Title>
              <Accordion.Content
                active={this.state.activeIndex.includes(index)}
              >
                {this.renderPremiumFunctions(index)}
              </Accordion.Content>
            </Card.Content>
          </Accordion>
        );
    });
    return displayFunctions;
  }
  renderNewCallFunctions() {
    const abiObject = JSON.parse(this.state.abi);
    let displayFunctions = [];
    abiObject.forEach((method, index) => {
      if (method.stateMutability === 'view')
        displayFunctions.push(
          <Accordion
            as={Card}
            link
            raised
            centered
            key={index}
            className="function"
            // style={{ background: dappData.colorLight }}
          >
            <Card.Content textAlign="left">
              <Accordion.Title
                active={this.state.activeIndex.includes(index)}
                index={index}
                onClick={this.handleToggleAccordian}
              >
                <Grid columns="equal" verticalAlign="middle">
                  <Grid.Column width={3}>
                    <Icon size="large" circular name="eye" />
                  </Grid.Column>
                  <Grid.Column fluid>
                    <Header style={{ wordWrap: 'break-word' }}>
                      {method.name}
                    </Header>
                  </Grid.Column>
                </Grid>
              </Accordion.Title>
              <Accordion.Content
                active={this.state.activeIndex.includes(index)}
              >
                {this.renderPremiumFunctions(index)}
              </Accordion.Content>
            </Card.Content>
          </Accordion>
        );
    });
    return displayFunctions;
  }
  renderPremiumInterface() {
    //Remove
    // const { dappData, activeIndex } = this.state;
    // const errorMessage = this.showErrorMessage('popup');
    // let displayPremiumInterface = [];
    // if (dappData.functions) {
    //   dappData.functions.forEach((item, index) => {
    //     displayPremiumInterface.push(
    //       <Accordion
    //         as={Card}
    //         link
    //         raised
    //         centered
    //         key={index}
    //         className="function"
    //         style={{ background: dappData.colorLight }}
    //       >
    //         <Card.Content textAlign="left">
    //           <Accordion.Title
    //             active={activeIndex.includes(index)}
    //             index={index}
    //             onClick={this.handleToggleAccordian}
    //           >
    //             <Grid columns={2} verticalAlign="middle">
    //               <Grid.Column>
    //                 <Icon
    //                   size="huge"
    //                   circular
    //                   name={item.icon}
    //                   style={{
    //                     background: dappData.colorDark,
    //                     color: 'white'
    //                     // color: dappData.colorLight
    //                   }}
    //                 />
    //               </Grid.Column>
    //               <Grid.Column>
    //                 <Header>{item.displayName}</Header>
    //               </Grid.Column>
    //             </Grid>
    //           </Accordion.Title>
    //           <Accordion.Content active={activeIndex.includes(index)}>
    //             {this.renderPremiumFunctions(
    //               index,
    //               true,
    //               item.helperText,
    //               dappData.colorDark
    //             )}
    //           </Accordion.Content>
    //         </Card.Content>
    //       </Accordion>
    //     );
    //   });
    // }
    // return (
    //   <div
    //     style={{
    //       paddingTop: '3em',
    //       paddingBottom: '5em'
    //     }}
    //   >
    //     <Container>
    //       <Card.Group>{displayPremiumInterface}</Card.Group>
    //     </Container>
    //     {errorMessage}
    //   </div>
    // );
  }
  renderPremiumFunctions(methodIndex, premium, helperText, colorDark) {
    if (this.state.abi) {
      try {
        const abiObject = JSON.parse(this.state.abi);
        const method = abiObject[methodIndex];
        let onSubmit = this.handleSubmitCall;
        var inputs = [];
        var outputs = [];
        let displayResponse = <div />;
        let displayMethod = <div />;
        let displayButton = <div />;
        let displayHelperText;
        if (helperText && helperText != '') {
          displayHelperText = (
            <Segment style={{ background: colorDark, color: 'white' }}>
              <i>{helperText}</i>
            </Segment>
          );
        }
        let displayFooterText = '';
        if (premium) {
          displayFooterText = <i>{method.name}</i>;
        }
        let buttonStyle = {
          backgroundColor: '#c2cafc'
        };
        if (colorDark) {
          buttonStyle = {
            backgroundColor: colorDark,
            color: 'white'
          };
        }
        if (method.stateMutability !== 'view' && method.type === 'function') {
          onSubmit = this.handleSubmitSend;
          method.inputs.forEach((input, j) => {
            inputs.push(
              <Form.Input
                required
                name={method.name}
                key={j}
                inputindex={j}
                label={input.name}
                placeholder={input.type}
                onChange={this.handleMethodDataChange}
              />
            );
          });
          if (method.payable) {
            inputs.push(
              <Form.Input
                required
                key={method.name}
                inputindex={-1}
                name={method.name}
                label={`Value to send (ETH)`}
                placeholder="value"
                onChange={this.handleMethodDataChange}
              />
            );
          }
          displayButton = (
            <Form.Button
              icon="write"
              labelPosition="left"
              content="Sign & Submit"
              style={buttonStyle}
            />
          );
        } else if (method.stateMutability === 'view') {
          method.inputs.forEach((input, j) => {
            inputs.push(
              <Form.Input
                required
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
          displayButton = (
            <Form.Button
              icon="refresh"
              content="Check"
              labelPosition="left"
              style={buttonStyle}
            />
          );
        }
        if (this.state.methodData[methodIndex].outputs.length > 0) {
          method.outputs.forEach((output, j) => {
            const outputData = this.state.methodData[methodIndex].outputs[j];
            outputs.push(
              <div key={j}>
                {output.name || '(unnamed)'} <i>{output.type}</i>:
                <Container style={{ wordWrap: 'break-word' }}>
                  <b>{outputData || ' '}</b>
                </Container>
              </div>
            );
          });
          displayResponse = (
            <div>
              <Divider style={{ marginBottom: 0 }} />
              <Header as="h4" textAlign="center" style={{ marginTop: 2 }}>
                Response
              </Header>
              {outputs}
            </div>
          );
        }
        displayMethod = (
          <div>
            {displayHelperText}
            <Form onSubmit={onSubmit} name={method.name} key={method.name}>
              {inputs}
              <Container textAlign="center">
                {displayButton}
                {displayFooterText}
              </Container>
            </Form>
            {displayResponse}
          </div>
        );
        return <div>{displayMethod}</div>;
      } catch (e) {
        return <h2>Error generating function from ABI</h2>;
      }
    }
  }
  render() {
    let {
      account,
      gwei,
      block,
      avgBlockTime,
      etherscan,

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
      //     contractName={getDappData}
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
      //       this.setState(
      //         {
      //           customLoader: customLoader,
      //           contracts: contracts
      //         },
      //         async () => {
      //           console.log('Contracts Are Ready:', this.state.contracts);
      //         }
      //       );
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
        // Simple UI tweak for TransactionsCustom
        <Responsive
          key="Transactions"
          minWidth={Responsive.onlyTablet.minWidth}
        >
          <TransactionsCustom
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
              console.log('Transaction Receipt', transaction, receipt);
            }}
          />
        </Responsive>
      );
    }
    let dapparatus;
    if (enableDapparatus) {
      dapparatus = (
        <Dapparatus
          config={{
            DEBUG: false,
            requiredNetwork: this.state.requiredNetwork,
            hide: displayDappForm,
            textStyle: {
              color: '#000000'
            },
            warningStyle: {
              fontSize: 20,
              color: '#d31717'
            },
            blockieStyle: {
              size: 5,
              top: 0
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
      mainDisplay = this.renderNewInterface();
    }
    return (
      <div className="App">
        <div className="content">
          <ResponsiveContainer
            className="ResponsiveContainer"
            dapparatus={dapparatus}
            dappData={this.state.dappData}
          >
            {mainDisplay}
            {connectedDisplay}
          </ResponsiveContainer>
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}

export default App;

// Mobile Responsive components
const ResponsiveContainer = ({ children, dapparatus, dappData }) => (
  <div>
    <DesktopContainer dapparatus={dapparatus} dappData={dappData}>
      {children}
    </DesktopContainer>
    <MobileContainer dapparatus={dapparatus} dappData={dappData}>
      {children}
    </MobileContainer>
  </div>
);
class DesktopContainer extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children, dapparatus, dappData } = this.props;
    let backgroundColor = null;
    if (dappData.premium) {
      backgroundColor = dappData.colorLight;
    }

    return (
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Menu borderless size="huge">
            <Menu.Menu className="topMenu" style={{ backgroundColor }}>
              <Menu.Item as="a" href="http://oneclickdapp.com">
                One Click dApp
              </Menu.Item>
              <Menu.Item as="a" href="http://oneclickdapp.com/new">
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
              <Menu.Item
                as="a"
                href="mailto:blockchainbuddha@gmail.com?subject=Custom dApp request from OneClickdApp.com"
                target="_self"
              >
                Hire Us
              </Menu.Item>
            </Menu.Menu>
            <div className="dapparatus">{dapparatus}</div>
          </Menu>
          <Heading dappData={dappData} />
        </Visibility>
        {children}
      </Responsive>
    );
  }
}
class MobileContainer extends Component {
  state = {};

  handlePusherClick = () => {
    const { sidebarOpened } = this.state;

    if (sidebarOpened) this.setState({ sidebarOpened: false });
  };

  handleToggle = () =>
    this.setState({ sidebarOpened: !this.state.sidebarOpened });

  render() {
    const { children, dapparatus, dappData } = this.props;
    const { sidebarOpened } = this.state;
    let backgroundColor = null;
    if (dappData.premium) {
      backgroundColor = dappData.colorLight;
    }
    return (
      <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="uncover"
            vertical
            inverted
            pointing
            borderless
            visible={sidebarOpened}
          >
            <Menu.Item as="a" href="http://oneclickdapp.com">
              Home
            </Menu.Item>
            <Menu.Item as="a" href="http://oneclickdapp.com/new">
              New
            </Menu.Item>
            <Menu.Item
              as="a"
              image={twitter}
              href="https://twitter.com/pi0neerpat"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </Menu.Item>
            <Menu.Item
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/blockchainbuddha/one-click-DApps"
              image={github}
            >
              Github
            </Menu.Item>
            <Menu.Item
              as="a"
              href="mailto:blockchainbuddha@gmail.com?subject=Custom dApp request from OneClickdApp.com"
              target="_self"
            >
              Hire Us
            </Menu.Item>
            <Menu.Item header>
              <br />
              <br />
              <br />
              Something not working? <br />
              Let us know in the chat at the bottom-right.
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher
            dimmed={sidebarOpened}
            onClick={this.handlePusherClick}
            style={{ minHeight: '100vh' }}
          >
            <Menu borderless size="large">
              <Menu.Menu className="topMenu" style={{ backgroundColor }}>
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name="sidebar" />
                </Menu.Item>
              </Menu.Menu>
              <div className="dapparatusMobile">{dapparatus}</div>
            </Menu>
            <Heading mobile dappData={dappData} />
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    );
  }
}
// Handles favicon, background, and header for premium dApp
const Heading = ({ mobile, dappData }) => {
  var link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = dappData.favicon;
  document.getElementsByTagName('head')[0].appendChild(link);
  document.body.style.background = '#c2cafc';
  // document.body.style.backgroundAttachment = 'fixed';

  if (dappData.premium) {
    const etherscan = translateEtherscan(dappData.network);
    const displayRegistryData = getRegistryData(
      dappData.network,
      dappData.metaData
    );
    if (dappData.colorDark) {
      // Set background color
      document.body.style.background = `linear-gradient(to right, ${
        dappData.colorDark
      }, ${dappData.colorLight})`;
    }
    let headerStyle = {
      // set default header background
      backgroundImage: ``,
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      backgroundRepeat: 'repeat-x'
    };
    if (dappData.backgroundImage) {
      // Set premium header background
      headerStyle.backgroundImage = `url(${dappData.backgroundImage})`;
    }
    return (
      <div className="defaultHeader" style={headerStyle}>
        <Container>
          <Header
            as="h1"
            content={dappData.dappName}
            style={{
              fontSize: mobile ? '2em' : '4em',
              fontWeight: 'normal',
              paddingTop: mobile ? '1em' : '1em',
              color: dappData.colorDark
            }}
          />
          <Image centered src={dappData.icon} size="small" />
          <Header
            as="h2"
            content={dappData.description}
            style={{
              fontSize: mobile ? '1.5em' : '1.7em',
              fontWeight: 'normal'
            }}
          />
          <Modal
            trigger={
              <Button
                style={{
                  marginTop: mobile ? '0.5em' : '.1em',
                  background: dappData.colorDark,
                  color: 'white'
                }}
              >
                Show Details
              </Button>
            }
          >
            <Modal.Header>About {dappData.dappName}</Modal.Header>
            <Modal.Content image>
              <Modal.Description>{dappData.instructions}</Modal.Description>
            </Modal.Content>
          </Modal>
        </Container>
      </div>
    );
  } else if (dappData) {
    const etherscan = translateEtherscan(dappData.network[0]);
    const displayRegistryData = getRegistryData(
      dappData.metaData,
      dappData.network
    );
    return (
      <div className="defaultHeader">
        <Grid
          stackable
          columns={2}
          style={{
            paddingTop: mobile ? '1em' : '2em'
          }}
        >
          <Grid.Row textAlign="center" verticalAlign="middle">
            <Grid.Column>
              <Header as="h1" style={{ wordWrap: 'break-word' }}>
                <b>{dappData.dappName}</b>
              </Header>
              <TwitterShareButton
                title={
                  '🔨 I just made an instant dApp called "' +
                  dappData.name +
                  '." View it at oneclickdapp.com' +
                  dappData.mnemonic
                }
                url={'www.oneclickdapp.com' + dappData.mnemonic}
                hashtags={['oneclickdapp', 'BUIDL']}
              >
                <Button icon primary size="small">
                  <Icon name="twitter" />
                  Tweet this dApp
                </Button>
              </TwitterShareButton>
            </Grid.Column>
            <Grid.Column>
              <Table basic unstackable definition>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <Image src={ethereum} size="mini" centered />
                    </Table.Cell>
                    <Table.Cell>
                      <b>{dappData.network}</b>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="center">
                      <Icon name="at" size="large" />
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        href={`${etherscan}address/${dappData.contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {dappData.contractAddress.substring(0, 6)}...
                        {dappData.contractAddress.substring(38, 50)}
                      </a>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="center">MetaData</Table.Cell>
                    <Table.Cell>{displayRegistryData} </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="center">
                      <Icon name="linkify" size="large" />
                    </Table.Cell>
                    <Table.Cell>
                      oneclickdapp.com<b>{dappData.mnemonic || '/ ...'}</b>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  } else {
    return null;
  }
};
ResponsiveContainer.propTypes = {
  children: PropTypes.node,
  dapparatus: PropTypes.object
};
DesktopContainer.propTypes = {
  children: PropTypes.node,
  dapparatus: PropTypes.object
};
MobileContainer.propTypes = {
  children: PropTypes.node
};
Heading.propTypes = {
  mobile: PropTypes.bool
};

function translateEtherscan(network) {
  let etherscan = 'https://etherscan.io/';
  if (network) {
    if (network === 'Unknown' || network === 'private') {
      etherscan = 'http://localhost:8000/#/';
    } else if (network === 'POA') {
      etherscan = 'https://blockscout.com/poa/core/';
    } else if (network === 'xDai') {
      etherscan = 'https://blockscout.com/poa/dai/';
    } else if (network !== 'Mainnet') {
      etherscan = 'https://' + network + '.etherscan.io/';
    }
  }
  return etherscan;
}
function getRegistryData(metaData, network) {
  let registryData = '(available only on mainnet)';
  if (metaData && metaData.data) {
    registryData = (
      <div>
        <Popup
          hoverable
          keepInViewPort
          position="bottom left"
          trigger={
            <Segment
              compact
              size="tiny"
              onClick={() => {
                window.open(metaData.data.metadata.url, '_blank');
              }}
            >
              <Image inline size="mini" src={metaData.data.metadata.logo} />
              {metaData.name}
            </Segment>
          }
        >
          <Table definition unstackable collapsing>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Description</Table.Cell>
                <Table.Cell>{metaData.data.metadata.description}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Verified</Table.Cell>
                <Table.Cell>
                  {JSON.stringify(metaData.data.metadata.reputation.verified)}
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
                <Table.Cell>{JSON.stringify(metaData.data.scamdb)}</Table.Cell>
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
        </Popup>
      </div>
    );
  } else if (network === 'Mainnet') {
    registryData = (
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
  return registryData;
}
