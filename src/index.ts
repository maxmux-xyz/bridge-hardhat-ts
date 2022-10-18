import { assert, expect } from "chai";
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
    const another_dest_wallet = dest_chain_provider.getSigner(2);

    const Sender = await ethers.getContractFactory("Sender");
    const Receiver = await ethers.getContractFactory("Receiver");

    const sender = Sender.attach(SENDER_ADDRESS).connect(source_wallet);
    const receiver = Receiver.attach(RECEIVER_ADDRESS).connect(dest_wallet);


    let sender_current_count = await sender.counter();
    let receiver_current_count = await receiver.counter()
    console.log(`Sender -- counter=${sender_current_count}`);
    console.log(`Receiver -- counter=${receiver_current_count}`);

    expect(sender_current_count).to.equal(receiver_current_count);

    await sender.confirm_sync(sender_current_count);
    await receiver.confirm_sync(receiver_current_count)

    await sender.start()
    await receiver.increment()

    expect(await sender.synced()).to.equal(await receiver.synced());

    sender_current_count = await sender.counter();
    receiver_current_count = await receiver.counter()

    await expect(
        sender
            .connect(another_source_wallet)
            .confirm_sync(sender_current_count)
    ).to.be.revertedWith('Not owner of contract');
    await expect(
        receiver
            .connect(another_dest_wallet)
            .confirm_sync(receiver_current_count)
    ).to.be.revertedWith('Not owner of contract');

    expect(await sender.synced()).to.equal(false);
    expect(await sender.synced()).to.equal(await receiver.synced());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});