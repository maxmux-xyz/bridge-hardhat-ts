// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Receiver {
    uint256 public counter;
    bool public synced;

    constructor() {
        console.log("Receiver -- Hello, World!");
        counter = 0;
        synced = true;
    }

    function increment() external {
        counter = counter + 1;
    }

    function get_count() external public view returns uint256 {
        return count
    }

    function confirm_sync() external onlyOwner() {
        synced = true;
    }

}