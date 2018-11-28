import React, { Component } from 'react';
import deepmerge from 'deepmerge';
let defaultConfig = {};
defaultConfig.DEBUG = true;
defaultConfig.hide = true;
class ContractLoaderCustom extends Component {
  constructor(props) {
    super(props);
    let config = defaultConfig;
    if (props.config) {
      config = deepmerge(config, props.config);
    }
    this.state = {
      config: config,
      contracts: {}
    };
  }
  contractLoader() {
    let { DEBUG } = this.state.config;
    let resultingContract;
    const contractName = this.props.contractName;
    const contractAddress = this.props.address;
    const contractAbi = this.props.abi;
    try {
      let contractObject = {
        address: contractAddress,
        abi: JSON.parse(contractAbi),
        blocknumber: 0
      };
      if (DEBUG)
        console.log(
          'ContractLoaderCustom - Loading ',
          contractName,
          contractObject
        );
      let contract = new this.props.web3.eth.Contract(
        contractObject.abi,
        contractObject.address
      );
      resultingContract = contract.methods;
      resultingContract._blocknumber = contractObject.blocknumber;
      resultingContract._address = contractObject.address;
      resultingContract._abi = contractObject.abi;
      resultingContract._contract = contract;
    } catch (e) {
      console.log('ERROR LOADING CONTRACT ' + contractName, e);
    }
    return resultingContract;
  }
  componentDidMount() {
    let { DEBUG } = this.state.config;
    if (DEBUG) console.log('ContractLoaderCustom - Loading Contracts');
    let contracts = {};
    contracts[this.props.contractName] = this.contractLoader();
    this.setState({ contracts: contracts }, () => {
      this.props.onReady(this.state.contracts, this.contractLoader.bind(this));
    });
  }
  render() {
    if (this.state.config.hide) {
      return false;
    } else {
      let contractDisplay = [];
      if (this.state.contracts) {
        for (let c in this.state.contracts) {
          contractDisplay.push(
            <div key={'contract' + c} style={{ margin: 5, padding: 5 }}>
              {c} ({this.state.contracts[c]._address}) - #{
                this.state.contracts[c]._blocknumber
              }
            </div>
          );
        }
      } else {
        contractDisplay = 'Loading...';
      }
      return (
        <div style={{ padding: 10 }}>
          <b>Contracts</b>
          {contractDisplay}
        </div>
      );
    }
  }
}
export default ContractLoaderCustom;
