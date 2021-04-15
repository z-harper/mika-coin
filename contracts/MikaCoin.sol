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
     * @dev If account A is approving account B to spend X number of MikaCoins.
     */
    mapping(address => mapping(address => uint256)) public allowance;

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
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

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

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) public returns (bool) {

        allowance[msg.sender][spender] = amount;
        
        emit Approval(msg.sender, spender, amount);
        
        return true;
    }

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        
        require(amount <= balanceOf[sender], "Transfer amount exceeds balance.");
        require(amount <= allowance[sender][msg.sender], "Transfer amount exceeds amount allowed to be transferred.");

        // update balances
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;

        // update allowances
        allowance[sender][msg.sender] -= amount;
        
        emit Transfer(sender, recipient, amount);
        
        return true;
    }
    
}