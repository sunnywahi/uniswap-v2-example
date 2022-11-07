import {ethers} from "hardhat";
import "dotenv/config";
import {AToken, UniswapV2} from "../typechain";

const prompt = require("prompt-sync")({sigint: true});

let tokenA: AToken;
let tokenB: AToken;
let ourSwapContract: UniswapV2;


async function main() {
    const Token = await ethers.getContractFactory("AToken");
    const UniswapV2 = await ethers.getContractFactory("UniswapV2");

    const firstAnswer = prompt(`${process.env.TOKEN_A_ADDRESS} is address of Token AAA?  (y:n): `);
    if (firstAnswer.trim() !== "y") {
        return false;
    }
    tokenA = await Token.attach(process.env.TOKEN_A_ADDRESS as string);

    const secondAnswer = prompt(`${process.env.TOKEN_B_ADDRESS} is address of Token BBB?  (y:n): `);
    if (secondAnswer.trim() !== "y") {
        return false;
    }
    tokenB = await Token.attach(process.env.TOKEN_B_ADDRESS as string);

    const thirdAnswer = prompt(`${process.env.SWAP_ADDRESS} is address of Uniswap v2?  (y:n): `);
    if (thirdAnswer.trim() !== "y") {
        return false;
    }
    ourSwapContract = await UniswapV2.attach(process.env.SWAP_ADDRESS as string);

    console.log("");
    console.log("");

    const addLqiuidity = prompt(`Do you want to add liquidity? (y/n): `);
    if (addLqiuidity.trim() !== "y") {
        return false;
    }

    console.log("");
    console.log("");
    console.log(`adding liquidity to our contract for 100 tokens of AAA and BBB`);
    let tx = await ourSwapContract.addLiquidity(tokenA.address, tokenB.address, ethers.utils.parseUnits("100", 6), ethers.utils.parseUnits("100", 6), {gasLimit: 3000000});
    await tx.wait();
    console.log("added liquidity to swap", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

