// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Receiver {
    uint256 public counter;
    address owner;
    mapping (uint=>bool) public processedNonces;

    event Increment (
        uint date,
        uint nonce
    );

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner of contract");
        _;
    }

    constructor() {
        console.log("Receiver -- Hello, World!");
        counter = 0;
        owner = msg.sender;
    }

    function increment(uint otherChainNonce) external onlyOwner() {
        require(msg.sender == owner, "Not owner");
        require(processedNonces[otherChainNonce] == false);
        processedNonces[otherChainNonce] = true;
        counter = counter + 1;
        emit Increment(block.timestamp, otherChainNonce);
        console.log("New nonce processed: %s", otherChainNonce);
    }
}
