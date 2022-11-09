import {ethers} from "hardhat";
import "dotenv/config";
import {UniswapV2} from "../typechain";

const prompt = require("prompt-sync")({sigint: true});

let swapContract: UniswapV2;

async function main() {
    const Token = await ethers.getContractFactory("AToken");
    const UniswapV2 = await ethers.getContractFactory("UniswapV2");

    const firstAnswer = prompt(`${process.env.TOKEN_A_ADDRESS} is address of Token AAA?  (y:n): `);
    if (firstAnswer.trim() !== "y") {
        return false;
    }
    const tokenA = await Token.attach(process.env.TOKEN_A_ADDRESS as string);

    const secondAnswer = prompt(`${process.env.TOKEN_B_ADDRESS} is address of Token BBB?  (y:n): `);
    if (secondAnswer.trim() !== "y") {
        return false;
    }
    const tokenB = await Token.attach(process.env.TOKEN_B_ADDRESS as string);

    const thirdAnswer = prompt(`${process.env.SWAP_ADDRESS} is address of Uniswap v2?  (y:n): `);
    if (thirdAnswer.trim() !== "y") {
        return false;
    }
    swapContract = await UniswapV2.attach(process.env.SWAP_ADDRESS as string);

    console.log("");
    console.log("");
    console.log(`we are swaping AAA 10 tokens with BBB and sending them to ${process.env.WALLET_TWO_ADDRESS}`);
    let tx = await swapContract.swap(tokenA.address, tokenB.address, ethers.utils.parseUnits("10", 6), process.env.WALLET_TWO_ADDRESS as string, {gasLimit: 3000000});
    await tx.wait();
    console.log("Successfully ", tx.hash);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
