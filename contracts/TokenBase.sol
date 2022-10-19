// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenBase is ERC20 {
    address public admin;

    modifier onlyAdmin {
        require(msg.sender == admin, "Not owner of contract");
        _;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        admin = msg.sender;
    }

    function updateAdmin(address newAdmin) external onlyAdmin() {
        admin = newAdmin;
    }


    function mint(address to, uint amount) external onlyAdmin() {
        _mint(to, amount);
    }

    function burn(address owner, uint amount) external onlyAdmin() {
        _burn(owner, amount);
    }
}
