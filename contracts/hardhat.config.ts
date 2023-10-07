import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import secrets from './.secrets.json';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      viaIR: false,
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 1337,
      forking: {
        url: secrets.nodeUrls.goerli,
        blockNumber: 7334900
      },
    },
    goerli: {
      url: secrets.nodeUrls.goerli,
      accounts: [secrets.privateKeys.goerli.deployer],
      gasPrice: "auto"
    },
    mainnetEth: {
      url: secrets.nodeUrls.mainnetEth,
      accounts: [secrets.privateKeys.mainnetEth.deployer],
      gasPrice: "auto"
    },
    mumbai: {
      url: secrets.nodeUrls.mumbai,
      accounts: [secrets.privateKeys.mumbai.deployer],
      gasPrice: "auto"
    },
    mainnetPoly: {
      url: secrets.nodeUrls.mainnetPoly,
      accounts: [secrets.privateKeys.mainnetPoly.deployer],
      gasPrice: "auto"
    }
  },
  etherscan: {
    apiKey: {
      goerli: secrets.etherscanAPI,
      mainnet: secrets.etherscanAPI,
      polygon: secrets.polygonscanAPI,
      polygonMumbai: secrets.polygonscanAPI,
    }
  }
};

export default config;
