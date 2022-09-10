import { ethers } from "hardhat";
const { providers } = ethers;

async function main() {

  const Sender = await ethers.getContractFactory("Sender");
  const Receiver = await ethers.getContractFactory("Receiver");

  const source_chain_provider = new providers.JsonRpcProvider('http://localhost:8555');
  const source_wallet = source_chain_provider.getSigner(0);

  const dest_chain_provider = new providers.JsonRpcProvider('http://localhost:8545');
  const dest_wallet = dest_chain_provider.getSigner(1);

  const sender = await Sender.connect(source_wallet).deploy();
  const receiver = await Receiver.connect(dest_wallet).deploy();

  await sender.deployed();
  await receiver.deployed();

  console.log(`const SENDER_ADDRESS = "${sender.address}";\nconst RECEIVER_ADDRESS = "${receiver.address}";`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
