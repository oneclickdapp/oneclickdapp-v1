import React, { Component } from 'react';
import { Button, Image } from 'semantic-ui-react';
const arrowLeft = require('../assets/arrow-left.png');
const arrowRight = require('../assets/arrow-right.png');

class Navigation extends Component {
  constructor(props) {
    super(props);
    let step = this.props.step;
    this.state = { step };
  }
  handleClick = () => {
    let newStep = this.state.step + (this.props.direction === 'left' ? -1 : 1);
    this.setState({ step: newStep }, () => {
      this.props.onUpdate(this.state);
    });
  };
  doNothing = () => {};
  render() {
    let style = {
      position: 'fixed',
      paddingTop: 30,
      marginBottom: 0,
      top: 100,
      left: 10,
      opacity: 0.75,
      zIndex: 10,
      paddingRight: 10,
      color: 'transparent',
      backgroundColor: 'transparent'
    };
    let image = arrowLeft;
    if (this.props.direction === 'right') {
      style.right = 10;
      style.left = null;
      image = arrowRight;
    }
    let onClick = this.handleClick;
    if (this.props.formSubmit) {
      onClick = this.doNothing;
    }

    return (
      <Button style={style} name="currentDappFormStep" onClick={onClick}>
        <Image src={image} size="tiny" />
      </Button>
    );
  }
}
// <Image size="mini" src={boulder} />

export default Navigation;
