//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "hardhat/console.sol";


contract Heritage {

  uint constant ONE_YEAR=2102400;

  address payable public  owner;
  address payable public  heir;
  address public factory;
  bool useFactory=false;
  uint public blocksToAwait;
  uint public lastUpdateBlock;

  event depositEvnt(address _from, uint _amount, uint _balance); 

  constructor(address payable _owner, address payable _heir, uint _awaitto ){
    console.log("Deploying with owner: [%s] heir: [%s] awaitto: %i",_owner,_heir, _awaitto);
    owner=_owner;
    heir=_heir;
    blocksToAwait=_awaitto;
    lastUpdateBlock=block.number;
    console.log("Block Number: %i",lastUpdateBlock);
  }
 
  modifier restrictedToOwner(address payable _owner) { 
    require(
      _owner == owner,
      "Not authorized. Owner is required"
    );
     _;
  }

  modifier restrictedToHeir(address payable _heir) {
    require(
      _heir == heir,
      "Not authorized. Heir is required"
    );
     _;
  }

  modifier restrictedToFactory() {
      require(
      !useFactory || (msg.sender == factory),
      "Not authorized. Only Factory Contract can call this method"
    );
     _;
  }

  function setFromFactory(address payable _owner, address _factory) public restrictedToOwner(_owner){
    factory=_factory;
    useFactory=true;
  }

  function inherit() public 
  restrictedToFactory 
  {
    console.log("Inherit funds [%i] to [%s]",address(this).balance,heir);
    console.log("Current Block [%i] awaitBlock [%i] lastupdated: [%i]",block.number,blocksToAwait,lastUpdateBlock);
    require((lastUpdateBlock+blocksToAwait)<block.number,
    "Not possible to inherit if global block number has not reached to stated limit");
    console.log("Contract balance [%i]",getBalance());
    require(address(this).balance>0,
    "Contract has no funds. Either has not been funded or has been previously inherited");
    uint amount=getBalance();
    heir.transfer(amount);
  }

  function update(address payable _owner) public restrictedToOwner(_owner){
    lastUpdateBlock=block.number;
    console.log("New Current Block [%i]",lastUpdateBlock);
  }

  function changeHair(address payable _owner,address payable _newHeir) public  restrictedToOwner(_owner){
    heir=_newHeir;
  }

  function returnFunds(address payable _owner, uint amount) 
  public restrictedToFactory restrictedToOwner(_owner){
    console.log("ReturnFunds %i",amount);
    update(_owner);
    lastUpdateBlock=block.number;
    require(amount <= getBalance(),
    "not enought funds");
    _owner.transfer(amount);//not send to avoid reentrancy issues
    console.log("Funds in contract ",getBalance());
  }

  function payto(address payable _owner, address payable _to, uint amount)
  public restrictedToFactory restrictedToOwner(_owner){
    console.log("PayTo [%s] value: %i",_to,amount);
    update(_owner);
    lastUpdateBlock=block.number;
    require(amount <= getBalance(),
    "not enought funds");
    _to.transfer(amount);//not send to avoid reentrancy issues
    console.log("Funds in contract ",getBalance());
  }

  //FALLBACK
  fallback() external payable {
    console.log("Recibed by fallback", msg.value);
    emit depositEvnt(msg.sender, msg.value, getBalance());
  }

  // TO TRANSFER FUNDS TO THIS CONTRACT. CALL DIRECTLY TO CONTRACT WITH NO FUNCTION
  receive() external payable {
        console.log("Recibed ", msg.value);
        emit depositEvnt(msg.sender, msg.value, getBalance());
  }

  //DESTRUCTOR EN CASE NEEDED. HANDLE WITH CARE!!!
  function finalize(address payable _owner) public restrictedToOwner(_owner)  {
    selfdestruct(owner);
  }

  // TO TRANSFER FUNDS TO THIS CONTRACT.
  function sendFunds() payable public{
      console.log("Recibed by sendFunds ", msg.value);
  }

  // GETTER FOR CONTRACT BALANCE
  function getBalance()  public view returns(uint)
  {
    console.log("Get Balance");
    return address(this).balance;
  }
 

}
