const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");

describe("HeritageFactory", function() {
  it("Should retrive OWNER", async function() {
    const Contract = await ethers.getContractFactory("HeritageFactory");
    const [Owner] = await ethers.getSigners()
    owner=await Owner.getAddress();
    
    console.log("OWNER: [%s]",owner)
    const instance = await Contract.deploy();
    
    await instance.deployed();

    expect(await instance.owner()).equal(owner);
  });

  it("Should create Heritage Contract", async function() {
    const Contract = await ethers.getContractFactory("HeritageFactory");
    const [Owner,Heir] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    console.log("OWNER: [%s] HEIR: [%s] ",owner,heir)
    const instance = await Contract.deploy();
    
    await instance.deployed();
    await instance.createNewHeritageContract(heir,2102400);
    
    expect(await instance.getBalance()).equal("0");
  });

  it("Should update", async function() {
    const Contract = await ethers.getContractFactory("HeritageFactory");
    const [Owner,Heir,NewHeir] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    newHeir=await NewHeir.getAddress();
    console.log("OWNER: [%s] HEIR: [%s] ",owner,heir)
    const instance = await Contract.deploy();
    
    await instance.deployed();
    await instance.createNewHeritageContract(heir,2102400);
    lastBlock=await instance.getLastUpdateBlock();
    await instance.update();
    newLastBlock=await instance.getLastUpdateBlock();
    expect(newLastBlock).gt(lastBlock);
  });
  
  it("Test return funds", async function() {
    const Contract = await ethers.getContractFactory("HeritageFactory");
    const [Owner,Heir] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    console.log("OWNER: [%s] HEIR: [%s] ",owner,heir)
    const instance = await Contract.deploy();
    funds=BigNumber.from(10000000000);
    
    await instance.deployed();
    await instance.createNewHeritageContract(heir,2102400);

    expect(await instance.getBalance()).equal(""+0);
    n1=await Owner.getBalance();
    await Owner.sendTransaction({
      to: instance.address,
      value: funds,
      gasPrice:0
    });
    contractBalance=await instance.getBalance();
    console.log("Balance "+contractBalance);
    assert(contractBalance.gt(0));
    n2=await Owner.getBalance();
    console.log("N1: "+n1);
    console.log("n2: "+n2);

    n1=await Owner.getBalance();
    await instance.returnFunds(funds); //No se que comisión esta pagando
    n2=await Owner.getBalance();
    console.log(">N1: "+n1);
    console.log(">n2: "+n2);
    balance=await instance.getBalance();
    expect(await instance.getBalance()).equal(""+0);

   
    await expect(
      instance.connect(Heir).returnFunds(100)
    ).to.be.revertedWith("Sender has no asigned contract");
  });

  it("Test inherit", async function() {
    const Contract = await ethers.getContractFactory("HeritageFactory");
    const [Owner,Heir] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    console.log("OWNER: [%s] HEIR: [%s] ",owner,heir)
    const instance = await Contract.deploy();
    funds=BigNumber.from(10000000000);
    
    await instance.deployed();
    await instance.createNewHeritageContract(heir,1); //Block 1 to permit inherit
    await Owner.sendTransaction({
      to: instance.address,
      value: funds,
      gasPrice:0
    });

    await instance.inherit(owner);
    expect(await instance.getBalance()).equal(""+0);

    
  });


})