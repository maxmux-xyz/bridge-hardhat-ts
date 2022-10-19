import { expect } from "chai";
import { ethers } from "hardhat";
const { providers } = ethers;

async function main() {
    // Getting all contracts
    const TokenA = await ethers.getContractFactory("TokenA");
    const BridgeA = await ethers.getContractFactory("BridgeA");
    const TokenB = await ethers.getContractFactory("TokenA");
    const BridgeB = await ethers.getContractFactory("BridgeB");

    // Connecting to chain A
    const chainAProvider = new providers.JsonRpcProvider('http://localhost:8555');
    const chainATokenDeployerWallet = chainAProvider.getSigner(0);
    const chainABridgeDeployerWallet = chainAProvider.getSigner(1);

    // Connecting to chain B
    const chainBProvider = new providers.JsonRpcProvider('http://localhost:8545');
    const chainBTokenDeployerWallet = chainBProvider.getSigner(2);
    const chainBBridgeDeployerWallet = chainBProvider.getSigner(3);

    // Deploying Token and Bridge contracts on both chains
    const tokenA = await TokenA.connect(chainATokenDeployerWallet).deploy();
    const tokenB = await TokenB.connect(chainBTokenDeployerWallet).deploy();

    await tokenA.deployed();
    await tokenB.deployed();

    const bridgeA = await BridgeA.connect(chainABridgeDeployerWallet).deploy(tokenA.address);
    const bridgeB = await BridgeB.connect(chainBBridgeDeployerWallet).deploy(tokenB.address);

    await bridgeA.deployed();
    await bridgeB.deployed();

    console.log(`const TokenA_ADDRESS = "${tokenA.address}";\nconst TokenB_ADDRESS = "${tokenB.address}";`);
    console.log(`const BridgeA_ADDRESS = "${bridgeA.address}";\nconst BridgeB_ADDRESS = "${bridgeB.address}";`);

    // Mint some tokens on ChainA / TokenA
    const receipt = await tokenA.connect(chainATokenDeployerWallet).mint(chainATokenDeployerWallet.getAddress(), 1000);
    console.log(receipt);
    let deployer_balance = await tokenA.balanceOf(chainATokenDeployerWallet.getAddress());
    console.log(deployer_balance);

    expect(deployer_balance).to.equal(1000);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
