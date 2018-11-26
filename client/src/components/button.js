import React, { Component } from 'react';
import "./dapparatus.css"

class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked:false
    }
  }
  click(){
    if(!this.state.clicked){
      this.setState({clicked:true})
      setTimeout(()=>{
        this.setState({clicked:false})
      },5000)
      this.props.onClick.apply( this, arguments );
    }
  }
  render(){
    let color = this.props.color

    if(!color || color=="blue"){
      color = "#6081c3"
    }else if(color=="green"){
      color = "#6ac360"
    }else if(color=="orange"){
      color = "#f7861c"
    }else if(color=="yellow"){
      color = "#f7ea1c"
    }else if(color=="red"){
      color = "#fe2311"
    }

    if(this.state&&this.state.clicked){
      color = "#999999"
    }

    const buttonStyles = {
        display: 'inline-block',
        padding: '5px 17px',
        backgroundColor: color,
        border: 'none',
        color: '#ffffff',
        cursor: 'pointer',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '16px',
        fontWeight: '700',
        textTransform: 'uppercase',
        boxShadow: '0 2px 5px 0px rgba(0, 0, 0, 0.25)',
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
        margin: 5,
    }


    if(this.props.size=="2"){
      buttonStyles.padding = '7.5px 25.5px'
      buttonStyles.fontSize = "24px"
      buttonStyles.margin = 7.5
    }else if(this.props.size=="3"){
      buttonStyles.padding = '10px 34px'
      buttonStyles.fontSize = "32px"
      buttonStyles.margin = 10
    }

    return (
        <button className="grow" style={buttonStyles} onClick={this.click.bind(this)}>
                {this.props.children}
        </button>
    )
  }


}

export default Button
