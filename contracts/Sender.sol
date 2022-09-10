// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Sender {
    uint256 public counter;
    bool public synced;

    constructor() {
        console.log("Sender -- Hello, World!");
        counter = 0;
        synced = true;
    }

    function start() external {
        if synced == true {
            counter = counter + 1;
            synced = false;
        } else {
            event("Not synced")
        }
    }

    function get_count() external public view returns uint256 {
        return count
    }

    function confirm_sync() external onlyOwner() {
        synced = true;
    }
}