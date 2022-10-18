// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Sender {
    uint256 public counter;
    bool public synced;
    address owner;

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner of contract");
        _;
    }

    constructor() {
        console.log("Sender -- Hello, World!");
        counter = 0;
        synced = false;
        owner = msg.sender;
    }

    function start() external {
        if (synced == true) {
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
