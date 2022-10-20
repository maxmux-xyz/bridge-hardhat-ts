import { expect } from "chai";
import { ethers } from "hardhat";

const SENDER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RECEIVER_ADDRESS = "0x8464135c8F25Da09e49BC8782676a84730C318bC";

async function main() {
    console.log("Bridge -- Hello, World!");
    const source_chain_provider = new ethers.providers.JsonRpcProvider('http://localhost:8555');
    const source_wallet = source_chain_provider.getSigner(0);
    const another_source_wallet = source_chain_provider.getSigner(2);

    const dest_chain_provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    const dest_wallet = dest_chain_provider.getSigner(1);
    const another_dest_wallet = dest_chain_provider.getSigner(3);

    const Sender = await ethers.getContractFactory("Sender");
    const Receiver = await ethers.getContractFactory("Receiver");

    const sender = Sender.attach(SENDER_ADDRESS).connect(source_wallet);
    const receiver = Receiver.attach(RECEIVER_ADDRESS).connect(dest_wallet);

    let sender_current_count = await sender.counter();
    let receiver_current_count = await receiver.counter()
    console.log(`Sender -- counter=${sender_current_count}`);
    console.log(`Receiver -- counter=${receiver_current_count}`);

    expect(sender_current_count).to.equal(receiver_current_count);

    let tx = await sender.start();
    let receipt = await tx.wait();

    // Getting nonce from Chain A
    let chainANonce: number = -1;
    if (receipt.events != undefined) {
        for (var i = 0; i < receipt.events.length; i++) {
            chainANonce = receipt.events[i].args?.nonce;
        };
    };

    if (chainANonce == -1) {
        // Exit Script
        console.log("chainANonce == -1");
    };
    console.log("chainANonce == %s", chainANonce);

    // Incrementing contract on Chain B with nonce from ChainA
    tx = await receiver.increment(chainANonce);
    receipt = await tx.wait();

    // Getting nonce from Chain B
    let chainBNonce: number = -1;
    if (receipt.events != undefined) {
        for (var i = 0; i < receipt.events.length; i++) {
            chainBNonce = receipt.events[i].args?.nonce;
        };
    };

    if (chainBNonce == -1) {
        // Exit Script
        console.log("chainBNonce == -1");
    };
    console.log("chainBNonce == %s", chainBNonce);
    expect(chainANonce).to.equal(chainBNonce);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});