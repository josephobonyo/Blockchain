require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { ALCHEMY_API_URL, METAMASK_PRIVATE_KEY, GANACHE_PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  
  networks: {
    sepolia: { 
      url: "https://ethereum-sepolia.publicnode.com", //ALCHEMY_API_URL,
      chainId: 11155111,               // based on the provided network ID
      accounts: [`0x${METAMASK_PRIVATE_KEY}`],
    },
    ganache: {
      url: "http://127.0.0.1:8545", // based on the provided hostname and port number
      chainId: 1337,               // based on the provided network ID
      accounts: [GANACHE_PRIVATE_KEY],
    }
  },
  
};