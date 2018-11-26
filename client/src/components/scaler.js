import React, { Component } from 'react';
import deepmerge from 'deepmerge';
let defaultConfig = {}
defaultConfig.DEBUG = false;
defaultConfig.startZoomAt = 900
defaultConfig.origin = "top left"
defaultConfig.adjustedZoom = 1.0

class Scaler extends Component {
  constructor(props) {
    super(props);
    let config = defaultConfig
    if(props.config) {
      config = deepmerge(config, props.config)
      if(props.config.requiredNetwork){ config.requiredNetwork = props.config.requiredNetwork}
    }
    this.state = {
      config:config
    }
  }
  updateDimensions() {
    this.setState({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight});
  }
  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  render() {


    let zoom = 1.0
    if(document.documentElement.clientWidth<this.state.config.startZoomAt){
      zoom=document.documentElement.clientWidth/this.state.config.startZoomAt
    }
    zoom = Math.min(1.0,this.state.config.adjustedZoom*zoom)

    return (
      <div style={{transform:"scale("+zoom+")",transformOrigin:this.state.config.origin}}>
        {this.props.children}
      </div>
    )
  }
}

export default Scaler;
