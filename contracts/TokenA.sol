// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import './TokenBase.sol';
import "hardhat/console.sol";

contract TokenA is TokenBase {
    constructor() TokenBase('Token A', 'TA') {}
}
