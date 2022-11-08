# Uniswap V2 Example

### Calling uniswap from smart-contract

This project uses Hardhat for contract compilation and deployment. We have configured goerli network in the same

#### Following env variables to be provided in .env file in root folder of the project

```javascript
# Your wallet private key
WALLET_PRIVATE_KEY=

# Your alchemy URL    
GOERLI_URL=
# your etherscan api key    
ETHERSCAN_API_KEY=
    
TOKEN_A_ADDRESS=0x970f3cE04C241B7f6E6aF506085591b5AFDF86eF
TOKEN_B_ADDRESS=0xD3211377F460D387762F6652bA30983D4AC612fC
SWAP_ADDRESS=0x951277782A5b6127D9ebD4983623742cDAc587e2

WALLET_ONE_ADDRESS=
WALLET_TWO_ADDRESS=
```

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
