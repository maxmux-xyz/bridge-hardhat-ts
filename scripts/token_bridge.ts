import { expect } from "chai";
import { ethers } from "hardhat";
const { providers } = ethers;

// Fake addresses from the hardhat local blockchain
const TokenA_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const TokenB_ADDRESS = "0x663F3ad617193148711d28f5334eE4Ed07016602";
const BridgeA_ADDRESS = "0x8464135c8F25Da09e49BC8782676a84730C318bC";
const BridgeB_ADDRESS = "0x057ef64E23666F000b34aE31332854aCBd1c8544";

async function main() {
    // Getting all contracts
    const TokenA = await ethers.getContractFactory("TokenA");
    const BridgeA = await ethers.getContractFactory("BridgeA");
    const TokenB = await ethers.getContractFactory("TokenB");
    const BridgeB = await ethers.getContractFactory("BridgeB");

    // Connecting to chain A
    const chainAProvider = new providers.JsonRpcProvider('http://localhost:8555');
    const chainATokenDeployerWallet = chainAProvider.getSigner(0);
    const chainABridgeDeployerWallet = chainAProvider.getSigner(1);

    // Connecting to chain B
    const chainBProvider = new providers.JsonRpcProvider('http://localhost:8545');
    const chainBTokenDeployerWallet = chainBProvider.getSigner(2);
    const chainBBridgeDeployerWallet = chainBProvider.getSigner(3);

    // Wallet addresses
    let chainATokenDeployerWalletAddress = await chainATokenDeployerWallet.getAddress()
    let chainABridgeDeployerWalletAddress = await chainABridgeDeployerWallet.getAddress()
    let chainBTokenDeployerWalletAddress = await chainBTokenDeployerWallet.getAddress()
    let chainBBridgeDeployerWalletAddress = await chainBBridgeDeployerWallet.getAddress()

    // Random user wallet
    const randomUserWallet = chainAProvider.getSigner(4);
    const randomUserWalletAddress = await randomUserWallet.getAddress()

    console.log("Wallets:")
    console.log(`chainATokenDeployerWallet: ${chainATokenDeployerWalletAddress}`)
    console.log(`chainABridgeDeployerWallet: ${chainABridgeDeployerWalletAddress}`)
    console.log(`chainBTokenDeployerWallet: ${chainBTokenDeployerWalletAddress}`)
    console.log(`chainBBridgeDeployerWallet: ${chainBBridgeDeployerWalletAddress}`)
    console.log(`randomUserWallet: ${randomUserWalletAddress}`)

    // Loading contracts
    const tokenA = TokenA.attach(TokenA_ADDRESS).connect(chainATokenDeployerWallet);
    const bridgeA = BridgeA.attach(BridgeA_ADDRESS).connect(chainABridgeDeployerWallet);
    const tokenB = TokenB.attach(TokenB_ADDRESS).connect(chainBTokenDeployerWallet);
    const bridgeB = BridgeB.attach(BridgeB_ADDRESS).connect(chainBBridgeDeployerWallet);

    console.log("Contracts:")
    console.log(`tokenA: ${tokenA.address}`)
    console.log(`bridgeA: ${bridgeA.address}`)
    console.log(`tokenB: ${tokenB.address}`)
    console.log(`bridgeB: ${bridgeB.address}`)

    let tokenABalance = await tokenA.balanceOf(randomUserWalletAddress);
    console.log(tokenABalance);
    expect(tokenABalance).to.equal(500);

    let tx = await bridgeA.connect(randomUserWallet).burn(randomUserWalletAddress, 50)
    let receipt = await tx.wait();

    let newTokenABalance = await tokenA.balanceOf(randomUserWalletAddress);
    console.log(newTokenABalance);
    expect(newTokenABalance).to.equal(450)

    // Getting info from from Chain A
    let chainANonce: number = -1;
    let burnAmount: number = -1;
    let from: string = "";
    let to: string = "";
    if (receipt.events != undefined) {
        for (const event of receipt.events) {
            console.log(`Event ${event.event} with args ${event.args}`);
        }
    }

    if (receipt.events != undefined) {
        for (var i = 0; i < receipt.events.length; i++) {
            chainANonce = receipt.events[i].args?.nonce;
            burnAmount = receipt.events[i].args?.amount;
            from = receipt.events[i].args?.from;
            to = receipt.events[i].args?.to;
        };
    };

    if (chainANonce == -1 || burnAmount == -1 || from == "") {
        // Should exit script
        console.log("chainANonce == -1 || burnAmount == -1 || addr == ''");
    };
    console.log(`const nonce = "${chainANonce}"`);
    console.log(`const burnAmount = "${burnAmount}"`);
    console.log(`const mint address: = "${from}"`);

    expect(from).to.equal(randomUserWalletAddress);

    // Mint on bridgeB with burn information from bridgeA
    // bridgeB contract owner is calling the contract by default
    let mint_tx = await bridgeB.mint(from, burnAmount, chainANonce);
    let mint_receipt = await mint_tx.wait();

    if (mint_receipt.events != undefined) {
        for (var i = 0; i < mint_receipt.events.length; i++) {
            chainANonce = mint_receipt.events[i].args?.nonce;
            burnAmount = mint_receipt.events[i].args?.amount;
            from = mint_receipt.events[i].args?.from;
            to = mint_receipt.events[i].args?.to;
        };
    };
    console.log(chainANonce, burnAmount, from, to);

    let balanceTokenB = await tokenB.balanceOf(to);
    console.log(balanceTokenB)
    expect(balanceTokenB).to.equal(50);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
