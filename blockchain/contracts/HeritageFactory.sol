//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";
import "./Heritage.sol";


/***************************************** HeritageFactory  ***********************************************
Contract for creating new Heritage contracts.
*/
contract HeritageFactory{

    address public owner;

    constructor(){
        owner=msg.sender;
    }

    struct HeritageInfo{
        address payable heritageContract;
        uint lastUpdatedBlock;
    }

    modifier restrictedToOwner() { 
    require(
      msg.sender == owner,
      "Factory - Not authorized. Owner is required"
    );
     _;
    }

    mapping(address => HeritageInfo) public heritageReferences;
    
    function createNewHeritageContract(address payable _heir, uint _awaitto) 
    public returns (address) {
      address payable sender=msg.sender;
      Heritage contractInstance=new Heritage(sender,_heir,_awaitto);
      contractInstance.setFromFactory(sender,address(this));
      HeritageInfo storage info=heritageReferences[sender];
      info.heritageContract=address(contractInstance);
      info.lastUpdatedBlock=block.number;
      console.log("Created new contract Sender: '%s'  Contract address: '%s')", msg.sender, address(contractInstance));
      return info.heritageContract;
    }

    //FALLBACK
    fallback() external payable {
      console.log("Recibed by fallback", msg.value);
    }

    // TO TRANSFER FUNDS TO THIS CONTRACT. CALL DIRECTLY TO CONTRACT WITH NO FUNCTION
    receive() external payable {
      console.log("Factory Recibed ", msg.value);
        address payable sender=msg.sender;
        HeritageInfo memory info=heritageReferences[sender];
        require(info.lastUpdatedBlock>0,"Sender has no asigned contract");
        (bool success, bytes memory data)=info.heritageContract.call{value:msg.value}("");
        if(!success) revert("Cannot send fund to contract");
    }

    // GETTER FOR CONTRACT BALANCE
  function getBalance(address sender)  public view returns(uint)
  {
    console.log("Get Balance");
    return address(heritageReferences[sender].heritageContract).balance;
  }

  function update() public {
    address payable sender=msg.sender;
    HeritageInfo memory info=heritageReferences[sender];
    require(info.lastUpdatedBlock>0,"Sender has no asigned contract");
    Heritage(info.heritageContract).update(sender);
  }

  function changeHair(address payable _newHeir) public {
    address payable sender=msg.sender;
    HeritageInfo memory info=heritageReferences[sender];
    require(info.lastUpdatedBlock>0,"Sender has no asigned contract");
    Heritage(info.heritageContract).changeHair(sender,_newHeir);
  }

  function getLastUpdateBlock() public view returns (uint){
    address payable sender=msg.sender;
    HeritageInfo memory info=heritageReferences[sender];
    require(info.lastUpdatedBlock>0,"Sender has no asigned contract");
    uint lastBlock=Heritage(info.heritageContract).lastUpdateBlock();
    return lastBlock;
  }

  function inherit(address payable _sender) public {
    address payable sender=_sender;
    HeritageInfo memory info=heritageReferences[sender];
    require(info.lastUpdatedBlock>0,"Sender has no asigned contract");
    Heritage(info.heritageContract).inherit();
  }

  function returnFunds(uint _amount) public {
    address payable sender=msg.sender;
    HeritageInfo memory info=heritageReferences[sender];
    require(info.lastUpdatedBlock>0,"Sender has no asigned contract");
    Heritage(info.heritageContract).returnFunds(msg.sender,_amount);
  }


}