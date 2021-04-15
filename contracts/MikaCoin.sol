// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract MikaCoin {
    
    string public name;
    string public symbol;
    uint256 public totalSupply;
    
    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * These values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
    }
}