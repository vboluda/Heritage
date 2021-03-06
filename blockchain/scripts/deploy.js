
const fs = require('fs');
const hre = require("hardhat");

async function main() {

  const HeritageFactory = await hre.ethers.getContractFactory("HeritageFactory");
  const heritageFactory = await HeritageFactory.deploy();

  await heritageFactory.deployed();

  console.log("HeritageFactoryto:", heritageFactory.address);

  let output={
    address:heritageFactory.address,
  };

  const Artifact = JSON.parse(fs.readFileSync('./artifacts/contracts/HeritageFactory.sol/HeritageFactory.json',
  {encoding:'utf8', flag:'r'}));


  fs.writeFileSync("../HeritageFactory.def", JSON.stringify(output),{encoding:'utf8'});

  fs.writeFileSync("../dapp/generated/Artifacts.js", "var artifact="+JSON.stringify({
    HeritageFactory:{
      abi:Artifact.abi,
      address:heritageFactory.address
    }
  })+";",{encoding:'utf8'});

  console.log("Done.");
}



main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
