import { expect } from "chai";
import { ethers } from "hardhat";
const { providers } = ethers;

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

    // Random user wallet
    const randomUserWallet = chainAProvider.getSigner(4);
    const randomUserWalletAddress = randomUserWallet.getAddress()

    // Deploying Token and Bridge contracts on both chains
    const tokenA = await TokenA.connect(chainATokenDeployerWallet).deploy();
    const tokenB = await TokenB.connect(chainBTokenDeployerWallet).deploy();

    await tokenA.deployed();
    await tokenB.deployed();

    const chainATokenDeployerWalletAddress = await chainATokenDeployerWallet.getAddress();

    const bridgeA = await BridgeA.connect(chainABridgeDeployerWallet).deploy(tokenA.address);
    const bridgeB = await BridgeB.connect(chainBBridgeDeployerWallet).deploy(tokenB.address);

    await bridgeA.deployed();
    await bridgeB.deployed();

    // Need to make Bridge contracts admins of token contracts
    await tokenA.newOtherAdmin(bridgeA.address);
    await tokenB.newOtherAdmin(bridgeB.address);

    console.log(`const TokenA_ADDRESS = "${tokenA.address}";\nconst TokenB_ADDRESS = "${tokenB.address}";`);
    console.log(`const BridgeA_ADDRESS = "${bridgeA.address}";\nconst BridgeB_ADDRESS = "${bridgeB.address}";`);

    // Mint some tokens on ChainA / TokenA
    const txTokenAMint = await tokenA.connect(chainATokenDeployerWallet).mint(chainATokenDeployerWalletAddress, 1000);
    let receipt = await txTokenAMint.wait();
    console.log(receipt);

    // Make sure those tokens were minted
    let deployer_balance = await tokenA.balanceOf(chainATokenDeployerWalletAddress);
    console.log(deployer_balance);
    expect(deployer_balance).to.equal(1000);

    // Send that those tokens to the random user
    let transfer_tokenA_tx = await tokenA.transfer(randomUserWalletAddress, 500);
    receipt = await transfer_tokenA_tx.wait();

    // Make sure random wallet has tokenA
    let random_wallet_balance = await tokenA.balanceOf(randomUserWalletAddress);
    console.log(random_wallet_balance);
    expect(random_wallet_balance).to.equal(500);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
