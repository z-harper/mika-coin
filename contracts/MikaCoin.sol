// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract MikaCoin {
    
    string public name;
    string public symbol;
    uint256 public totalSupply;

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    mapping(address => uint256) public balanceOf;

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * These values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _initialSupply;
        // Allocate supply of tokens to contract creator
        balanceOf[msg.sender] = _initialSupply;
    }

    /**
     * @dev Moves {amount} tokens from the caller's account to {recipient}.
     *
     * The caller must have a balance of at least {amount}.
     * 
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Transfer amount exceeds balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;

        emit Transfer(msg.sender, recipient, amount);
        
        return true;
    }
}