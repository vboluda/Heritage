const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");
describe("Heritage", function() {
  it("Should retrive OWNER", async function() {
    const Contract = await ethers.getContractFactory("Heritage");
    const [Owner, Heir] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    console.log("OWNER: [%s] HEIR: [%s] ",owner,heir)
    const instance = await Contract.deploy(owner,heir,2102400);
    
    await instance.deployed();

    expect(await instance.owner()).equal(owner);
  });

  it("Should retrive HEIR", async function() {
    const Contract = await ethers.getContractFactory("Heritage");
    const [Owner, Heir] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    console.log("OWNER: [%s] HEIR: [%s] ",owner,heir)
    const instance = await Contract.deploy(owner,heir,2102400);
    
    await instance.deployed();

    expect(await instance.heir()).equal(heir);
  });

  it("Should retrive BlocksToWait", async function() {
    const Contract = await ethers.getContractFactory("Heritage");
    const [Owner, Heir] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    console.log("OWNER: [%s] HEIR: [%s] ",owner,heir)
    const instance = await Contract.deploy(owner,heir,2102400);
    
    await instance.deployed();

    expect(await instance.blocksToAwait()).equal(""+2102400);
  });

  it("Test Balance", async function() {
    const Contract = await ethers.getContractFactory("Heritage");
    const [Owner, Heir] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    funds=BigNumber.from(10000000000);

    const instance = await Contract.deploy(owner,heir,2102400);
    
    await instance.deployed();
    console.log("**** CHECK BALANCES");
    ownerFunds=await Owner.getBalance();
    console.log("OWNER BALANCE: "+ownerFunds);

    expect(await instance.getBalance()).equal("0");

    tx={
      to: instance.address,
      value: funds,
      gasPrice:0
    };
    await Owner.sendTransaction(tx);
    console.log("TX.value "+tx.value);

    
    currentFunds=ownerFunds.sub(funds);

    expect(await instance.getBalance()).equal(""+funds);
    r1=await Owner.getBalance();
    r2=currentFunds;
    res=r1.eq(r2);
    assert(res,"Initial funds and current funds must be the same");

  });

  it("Test return funds", async function() {
    const Contract = await ethers.getContractFactory("Heritage");
    const [Owner, Heir] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    funds=BigNumber.from(10000000000);

    ownerFunds=await Owner.getBalance();

    const instance = await Contract.deploy(owner,heir,2102400);
    await instance.deployed();
    console.log("Heir funds : "+(await Heir.getBalance()));

    n1=await Owner.getBalance();
    await Owner.sendTransaction({
      to: instance.address,
      value: funds,
      gasPrice:0
    });
    n2=await Owner.getBalance();
    console.log("N1: "+n1);
    console.log("n2: "+n2);

    n1=await Owner.getBalance();
    await instance.returnFunds(owner,funds); //No se que comisión esta pagando
    n2=await Owner.getBalance();
    console.log(">N1: "+n1);
    console.log(">n2: "+n2);
    expect(await instance.getBalance()).equal(""+0);
    currentFunds=await Owner.getBalance();
    diff=new BigNumber.from("10895664000000000");
    console.log("PREVIOUS FUNDS: "+ownerFunds);
    console.log("CURRENT  FUNDS: "+currentFunds);
    console.log("DIFF     FUNDS: 00000"+ownerFunds.sub(currentFunds));
    console.log("CURR FUNDS+10 : "+currentFunds.add(diff));
    
    assert(ownerFunds.gt(currentFunds),"Previous balance must be greater than new balance");
  });

  it("Test payto funds", async function() {
    const Contract = await ethers.getContractFactory("Heritage");
    const [Owner, Heir,Third] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    funds=BigNumber.from(10000000000);

    thirdFunds=await Third.getBalance();
    third=await Third.getAddress();

    const instance = await Contract.deploy(owner,heir,2102400);
    
    await instance.deployed();
    console.log("Third funds : "+thirdFunds);


    await Owner.sendTransaction({
      to: instance.address,
      value: funds,
      gasPrice:0
    });

    n1=await Third.getBalance();
    await instance.payto(owner,third,funds); //No se que comisión esta pagando
    n2=await Third.getBalance();
    console.log(">N1: "+n1);
    console.log(">n2: "+n2);
    console.log("DIFF: "+n2.sub(funds));
    
    assert(thirdFunds.eq(n2.sub(funds)),"Previous Third party balance must be current balance plus new funds");
  });

  it("Test inherit",async function(){
    const Contract = await ethers.getContractFactory("Heritage");
    const [Owner, Heir,Third] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    funds=BigNumber.from(10000000000);
    heirFunds=await Heir.getBalance();
    
    const instance = await Contract.deploy(owner,heir,1); //To test must wait just 1 block
    
    await instance.deployed();
    console.log("Heir funds : "+heirFunds);


    await Owner.sendTransaction({
      to: instance.address,
      value: funds,
      gasPrice:0
    });

    expect(await instance.getBalance()).equal(""+funds);

    n1=await Heir.getBalance();
    await instance.inherit(heir);
    n2=await Heir.getBalance();
    expect(await instance.getBalance()).equal("0");
  });

  it("Test inherit not possible require block await",async function(){
    const Contract = await ethers.getContractFactory("Heritage");
    const [Owner, Heir,Third] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    funds=BigNumber.from(10000000000);
    heirFunds=await Heir.getBalance();
    
    const instance = await Contract.deploy(owner,heir,1000000); //1000000 to force error
    
    await instance.deployed();
    console.log("Heir funds : "+heirFunds);

    

    await Owner.sendTransaction({
      to: instance.address,
      value: funds,
      gasPrice:0
    });

    expect(await instance.getBalance()).equal(""+funds);

    await expect(
      instance.inherit(heir)
    ).to.be.revertedWith("Not possible to inherit if global block number has not reached to stated limit");
  });
  

  it("Test inherit not possible require funds",async function(){
    const Contract = await ethers.getContractFactory("Heritage");
    const [Owner, Heir,Third] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    funds=BigNumber.from(10000000000);
    heirFunds=await Heir.getBalance();
    
    const instance = await Contract.deploy(owner,heir,1); //1000000 to force error
    
    await instance.deployed();
    console.log("Heir funds : "+heirFunds);

    //To force block creation
    await Owner.sendTransaction({
      to: owner,
      value: funds,
      gasPrice:0
    });

    expect(await instance.getBalance()).equal("0");
    console.log("Current contract balance: "+await instance.getBalance());
    await expect(
      instance.inherit(heir)
    ).to.be.revertedWith("Contract has no funds. Either has not been funded or has been previously inherited"); 
  });

  it("Test destroy contract", async function() {
    const Contract = await ethers.getContractFactory("Heritage");
    const [Owner, Heir] = await ethers.getSigners()
    owner=await Owner.getAddress();
    heir=await Heir.getAddress();
    funds=BigNumber.from(10000000000);

    ownerFunds=await Owner.getBalance();
    console.log("**** DESTROY");
    const instance = await Contract.deploy(owner,heir,2102400);
    
    await instance.deployed();
    console.log("Heir funds : "+(await Heir.getBalance()));

    n1=await Owner.getBalance();
    await Owner.sendTransaction({
      to: instance.address,
      value: funds,
      gasPrice:0
    });
    n2=await Owner.getBalance();
    console.log("N1: "+n1);
    console.log("n2: "+n2);

    n1=await Owner.getBalance();
    await instance.finalize(owner); //No se que comisión esta pagando
    n2=await Owner.getBalance();
    console.log(">N1: "+n1);
    console.log(">n2: "+n2);
    
    currentFunds=await Owner.getBalance();
    diff=new BigNumber.from("10895664000000000");
    console.log("PREVIOUS FUNDS: "+ownerFunds);
    console.log("CURRENT  FUNDS: "+currentFunds);
    console.log("DIFF     FUNDS: 00000"+ownerFunds.sub(currentFunds));
    console.log("CURR FUNDS+10 : "+currentFunds.add(diff));
    
    assert(ownerFunds.gt(currentFunds),"Previous balance must be greater than new balance");
  });

});
