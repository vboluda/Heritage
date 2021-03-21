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

    heritageContractStruct=await instance.heritageReferences(owner);
    
    expect(await instance.getBalance()).equal("0");
  });
      

})