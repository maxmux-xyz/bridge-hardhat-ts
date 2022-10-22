// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract TokenBase is ERC20 {
    address public admin;
    mapping (address=>bool) public otherAdmins;

    modifier onlyAdmin {
        require(msg.sender == admin, "Not owner of contract");
        _;
    }

    modifier isAdmin {
        require(otherAdmins[msg.sender] == true, "Not one of the admins of contract");
        _;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        console.log("TokenBase -- Hello World!");
        admin = msg.sender;
        otherAdmins[admin] = true;
    }

    function updateAdmin(address newAdmin) external onlyAdmin() {
        admin = newAdmin;
    }

    function newOtherAdmin(address newAdmin) external onlyAdmin() {
        otherAdmins[newAdmin] = true;
    }

    function mint(address to, uint amount) external isAdmin() {
        console.log("mint address: %s", to);
        _mint(to, amount);
    }

    function burn(address owner, uint amount) external isAdmin() {
        console.log("burn address: %s", owner);
        _burn(owner, amount);
    }
}
