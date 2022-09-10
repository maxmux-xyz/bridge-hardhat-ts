import { ethers } from "hardhat";

const SENDER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RECEIVER_ADDRESS = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

async function main() {
    console.log("Bridge -- Hello, World!");
    const source_chain_provider = new ethers.providers.JsonRpcProvider('http://localhost:8555');
    const source_wallet = source_chain_provider.getSigner(0);

    const dest_chain_provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    const dest_wallet = dest_chain_provider.getSigner(1);

    const Sender = await ethers.getContractFactory("Sender");
    const Receiver = await ethers.getContractFactory("Receiver");

    const sender = Sender.attach(SENDER_ADDRESS).connect(source_wallet);
    const receiver = Receiver.attach(RECEIVER_ADDRESS).connect(dest_wallet);

    console.log(`Sender -- counter=${await sender.counter()}`);
    console.log(`Receiver -- counter=${await receiver.counter()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});