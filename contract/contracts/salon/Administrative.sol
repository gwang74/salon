pragma solidity ^0.5.0;

contract Administrative {
    address public owner;
    address public administrator;

    constructor() public {
        owner = msg.sender;
        administrator = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can modify this");
        _;
    }

    modifier onlyAdministrator {
        require(msg.sender == administrator, "only administrator can modify this");
        _;
    }

    modifier onlyPrivileged() {
        require((msg.sender == owner) || (msg.sender == administrator), "only owner or administrator can modify this");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }

    function transferAdministrator(address newAdministrator) public onlyPrivileged {
        if (newAdministrator != address(0)) {
            administrator = newAdministrator;
        }
    }

}