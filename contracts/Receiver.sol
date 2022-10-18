// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Receiver {
    uint256 public counter;
    bool public synced;
    address owner;

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner of contract");
        _;
    }

    constructor() {
        console.log("Receiver -- Hello, World!");
        counter = 0;
        synced = false;
        owner = msg.sender;
    }

    function increment() external {
        if (synced) {
            counter = counter + 1;
            synced = false;
            console.log("New counter: ", counter);
        } else {
            console.log("Not synced");
        }
    }

    function confirm_sync(uint256 bridgedCounter) external onlyOwner() {
        if (bridgedCounter == counter) {
            synced = true;
            console.log("Contracts are synced! Can count again");
        } else {
            console.log("Contracts not synced.");
        }
    }
}
