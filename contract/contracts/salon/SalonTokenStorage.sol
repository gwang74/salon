pragma solidity ^0.5.0;

import "./Administrative.sol";
// import "./IExtendedERC20.sol";

// 独立的存储合约
contract SalonTokenStorage is Administrative {
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowed;

    //getters
    function getTotalSupply() public view onlyPrivileged returns (uint256) {
        return _totalSupply;
    }

    function getName() public view onlyPrivileged returns (string memory) {
        return _name;
    }

    function getSymbol() public view onlyPrivileged returns (string memory) {
        return _symbol;
    }

    function getDecimals() public view onlyPrivileged returns (uint8) {
        return _decimals;
    }

    function getBalances(address who) public view onlyPrivileged returns (uint256) {
        return _balances[who];
    }

    function getAllowed(address owner, address spender) public view onlyPrivileged returns (uint256) {
        return _allowed[owner][spender];
    }


    //setters
    function setTotalSupply(uint256 value) public onlyPrivileged {
        _totalSupply = value;
    }

    function setName(string memory value) public onlyPrivileged {
        _name = value;
    }

    function setSymbol(string memory value) public onlyPrivileged {
        _symbol = value;
    }

    function setDecimals(uint8 value) public onlyPrivileged {
        _decimals = value;
    }

    function setBalances(address who, uint256 value) public onlyPrivileged {
        _balances[who] = value;
    }

    function setAllowed(address owner, address spender, uint256 value) public onlyPrivileged {
        _allowed[owner][spender] = value;
    }
}
