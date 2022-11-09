import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "@typechain/hardhat";


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        // runs: 1
      }
    },
  },
  networks :{
    hardhat: {
      initialBaseFeePerGas: 0,
      gasPrice: 0,
      chainId: 1337,
      accounts: {
        count: 20,
      },
    },
    localhost: {
      chainId: 1337,
      url: "http://127.0.0.1:8545/",
    },
    goerli: {
      url: process.env.GOERLI_URL || "https://eth-goerli.g.alchemy.com/v2/pEV6o9q1MlwEFKO-ksD3gTtm1P-_2Cu7",
      accounts: [`0x${process.env.WALLET_PRIVATE_KEY}`],
      chainId: 5
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: "typechain",
  },
};

export default config;
