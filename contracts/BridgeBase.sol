// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IToken.sol";

contract BridgeBase {
    address admin;
    IToken public token;
    uint public nonce;
    mapping (uint=>bool) public processedNonces;

    enum Step {Burn, Mint}
    event Transfer(
        address from,
        address to,
        uint amount,
        uint date,
        uint nonce,
        Step indexed step
    );

    constructor (address _token) {
        console.log("BridgeBase -- Hello World!");
        admin = msg.sender;
        token = IToken(_token);
    }

    function getProcessedNonce(uint desiredNonce) external view returns(bool) {
        return processedNonces[desiredNonce];
    }

    modifier onlyAdmin {
        require(msg.sender == admin, "Not owner of contract");
        _;
    }

    function burn(address to, uint amount) external {
        token.burn(msg.sender, amount);
        emit Transfer(msg.sender, to, amount, block.timestamp, nonce, Step.Burn);
        nonce++;
    }

    function mint(address to, uint amount, uint otherChainNonce) external onlyAdmin() {
        require(processedNonces[otherChainNonce] == false, "transfer already processed");
        processedNonces[otherChainNonce] = true;
        token.mint(to, amount);
        emit Transfer(msg.sender, to, amount, block.timestamp, otherChainNonce, Step.Mint);
    }
}
