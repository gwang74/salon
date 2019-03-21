pragma solidity ^0.5.0;

import "./SalonTokenStorage.sol";
import "../0xcert/math/SafeMath.sol";
import "./IExtendedERC20.sol";

contract SalonTokenImpl is Administrative {
    using SafeMath for uint256;
    SalonTokenStorage tokenStorage;
    uint unit;

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    event Mint(
        address indexed account,
        uint256 value
    );

    event Burn(
        address indexed account,
        uint256 value
    );

    constructor(address storageAddr, uint decimals) public {
        tokenStorage = SalonTokenStorage(storageAddr);
        unit = 10 ** decimals;
    }

    function name() public view onlyPrivileged returns (string memory) {
        return tokenStorage.getName();
    }

    function symbol() public view onlyPrivileged returns (string memory) {
        return tokenStorage.getSymbol();
    }

    function decimals() public view onlyPrivileged returns (uint8) {
        return tokenStorage.getDecimals();
    }

    function totalSupply() external view onlyPrivileged returns (uint256) {
        return tokenStorage.getTotalSupply();
    }

    function balanceOf(address who) external view onlyPrivileged returns (uint256) {
        return tokenStorage.getBalances(who);
    }

    function allowance(address owner, address spender) external view onlyPrivileged returns (uint256) {
        return tokenStorage.getAllowed(owner, spender);
    }

    function transfer(address from, address to, uint256 value) external onlyPrivileged returns (bool) {
        _transfer(from, to, value);
        return true;
    }

    function approve(address approver, address spender, uint256 value) external onlyPrivileged returns (bool) {
        require(spender != address(0));

        tokenStorage.setAllowed(approver, spender, value);
        emit Approval(approver, spender, value);
        return true;
    }

    function transferFrom(address from, address spender, address to, uint256 value) external onlyPrivileged returns (bool) {
        tokenStorage.setAllowed(from, spender, tokenStorage.getAllowed(from, spender).sub(value));
        _transfer(from, to, value);
        return true;
    }

    function increaseAllowance(address approver, address spender, uint256 addedValue) external onlyPrivileged returns (bool) {
        require(spender != address(0));

        tokenStorage.setAllowed(approver, spender, tokenStorage.getAllowed(approver, spender).add(addedValue));
        emit Approval(approver, spender, tokenStorage.getAllowed(approver, spender));
        return true;
    }

    function decreaseAllowance(address approver, address spender, uint256 subtractedValue) external onlyPrivileged returns (bool) {
        require(spender != address(0));

        tokenStorage.setAllowed(approver, spender, tokenStorage.getAllowed(approver, spender).sub(subtractedValue));
        emit Approval(approver, spender, tokenStorage.getAllowed(approver, spender));
        return true;
    }

    function mint(address account, uint256 value) external onlyPrivileged returns (bool) {
        require(account != address(0));
        //TODO:impl 作恶超发？ 应该放到storage里面判断
        require((tokenStorage.getTotalSupply() + value) <= (10000 * unit));

        tokenStorage.setTotalSupply(tokenStorage.getTotalSupply().add(value));
        tokenStorage.setBalances(account, tokenStorage.getBalances(account).add(value));
        emit Mint(account, value);
        emit Transfer(address(0), account, value);
        return true;
    }

    function burn(address account, uint256 value) external onlyPrivileged returns (bool) {
        require(account != address(0));

        tokenStorage.setTotalSupply(tokenStorage.getTotalSupply().sub(value));
        tokenStorage.setBalances(account, tokenStorage.getBalances(account).sub(value));
        emit Burn(account, value);
        return true;
    }

    function transferByAdministrator(address from, address to, uint value) external onlyPrivileged returns (bool) {
        _transfer(from, to, value);
        return true;
    }

    function _transfer(address from, address to, uint256 value) internal onlyPrivileged {
        require(to != address(0));

        tokenStorage.setBalances(from, tokenStorage.getBalances(from).sub(value));
        tokenStorage.setBalances(to, tokenStorage.getBalances(to).add(value));
        emit Transfer(from, to, value);
    }
}
