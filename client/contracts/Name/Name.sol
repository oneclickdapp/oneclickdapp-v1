pragma solidity ^0.4.24;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract Name is Ownable{
  string public name;

  constructor(string _name) public {
    name = _name;
  }

  function setName(string _name) onlyOwner public returns (bool){
    name = _name;
    return true;
  }
}
