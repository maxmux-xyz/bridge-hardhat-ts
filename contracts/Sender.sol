// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Sender {
    uint256 public counter;
    address owner;
    uint nonce;
    mapping (uint=>bool) public processedNonces;

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner of contract");
        _;
    }

    event Increment(
        uint date,
        uint nonce
    );

    constructor() {
        console.log("Sender -- Hello, World!");
        counter = 0;
        nonce = 0;
        owner = msg.sender;
    }

    function start() external onlyOwner() {
        counter = counter + 1;
        console.log("Count + 1: %s", counter);
        nonce = nonce + 1;
        console.log("New nonce: %s", counter);
        emit Increment(block.timestamp, nonce);
    }
}
