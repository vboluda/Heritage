require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
  networks:{
    local:{
      chainId:20210306,
      gas:"auto",
      url:"http://127.0.0.1:8118"
    },
    rinkeby:{
      chainId:4,
      gas:"auto",
      gasPrice:4*1000000000,
      url:"http://127.0.0.1:8545"
    }
  }
};

