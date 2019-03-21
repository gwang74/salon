pragma solidity ^0.5.0;

interface IUpgradeable {
    function upgrade(address newImpl) external;

    event Upgrade(
        address indexed newAddress,
        address indexed oldAddress
    );
}
