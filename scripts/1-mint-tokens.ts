import {ethers} from "hardhat";
import "dotenv/config";
import {AToken, UniswapV2} from "../typechain";

const prompt = require("prompt-sync")({sigint: true});

let tokenA: AToken;
let tokenB: AToken;
let swap: UniswapV2;


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

    console.log("");
    console.log("");
    //here mint AAA tokens
    const answer = prompt(`Are you sure you want to mint AAA Token to WALLET_ONE_ADDRESS? (y/n): `);
    if (answer.trim() == "y") {
        let tx = await tokenA.mint(process.env.WALLET_ONE_ADDRESS as string, ethers.utils.parseUnits("10000", 6));
        await tx.wait();
        console.log("token AAA minted for amount 500000", tx.hash);
    }

    console.log("");
    console.log("");
    //here mint AAA tokens
    const mint2Answer = prompt(`Are you sure you want to mint BBB Token to WALLET_ONE_ADDRESS? (y/n): `);
    if (mint2Answer.trim() == "y") {
        let tx = await tokenB.mint(process.env.WALLET_ONE_ADDRESS as string, ethers.utils.parseUnits("10000", 6));
        await tx.wait();
        console.log("token BBB minted for amount 500000", tx.hash);
    }

    console.log("");
    console.log("");
    const thirdAnswer = prompt(`${process.env.SWAP_ADDRESS} is address of Uniswap v2?  (y:n): `);
    if (thirdAnswer.trim() !== "y") {
        return false;
    }
    swap = await UniswapV2.attach(process.env.SWAP_ADDRESS as string);

    console.log(`approving swap contract at ${swap.address} to use ${ethers.constants.MaxUint256} of Token A and Token B`);
    let tx = await tokenA.approve(swap.address, ethers.constants.MaxUint256);
    await tx.wait();

    tx = await tokenB.approve(swap.address, ethers.constants.MaxUint256);
    await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

