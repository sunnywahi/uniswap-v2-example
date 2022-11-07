import { ethers } from "hardhat";
import {AToken, UniswapV2} from "../typechain";

const prompt = require("prompt-sync")({sigint: true});

let tokenA: AToken;
let tokenB: AToken;
let swap: UniswapV2;

async function main() {
  const Token = await ethers.getContractFactory("AToken");

  console.log("");
  console.log("");
  console.log(`===> Deploying 2 ERC20 Token with Symbol AAA and BBB`);
  //deploy first token
  tokenA = (await Token.deploy("defi Token A", "A$A"))as AToken;
  await tokenA.deployed();

  //deploy second token
  tokenB = (await Token.deploy("defi Token B", "B$B"))as AToken;
  await tokenB.deployed();
  console.log(`====> Token AAA ${tokenA.address} and BBB ${tokenB.address} are deployed`);

  console.log("");
  console.log("");
  const answer = prompt(`Are you sure you want to deploy uniswap v2 next? (y:n): `);
  if (answer.trim() !== "y") {
    return false;
  }

  console.log(`===> Deploying Swap contract`);
  const UniswapV2 = await ethers.getContractFactory("UniswapV2");
  swap = (await UniswapV2.deploy()) as UniswapV2;
  await swap.deployed();
  console.log(`our uniswap contract deployed ${swap.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
