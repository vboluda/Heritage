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

    // GETTER FOR CONTRACT BALANCE
  function getBalance()  public view returns(uint)
  {
    console.log("Get Balance");
    return address(heritageReferences[msg.sender].heritageContract).balance;
  }


}