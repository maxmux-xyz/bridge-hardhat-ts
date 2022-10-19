// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import './TokenBase.sol';

contract TokenB is TokenBase {
  constructor() TokenBase('Token B', 'TB') {}
}
