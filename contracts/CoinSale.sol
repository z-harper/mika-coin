// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import './MikaCoin.sol';

/**
 * provision tokens to token sale contract
 * set a token price in wei
 * assign an admin 
 * buy tokens 
 * end sale
 */

contract CoinSale {

    address private admin;  // address of person who deployed contract
    MikaCoin public coinContract;  // contract datatype
    uint256 public coinPrice;
    uint256 public coinsSold;

    event Sell(address _buyer, uint256 _amount);

    /**
     * @dev Assigns admin and allows admin to end token sale 
     *
     * @param _coinContract: pass MikaCoin contract so can use its functions 
     * @param _coinPrice: price of token from 2_deploy_contracts
     * Reference to MikaCoin so portion of created tokens can 
     * be assigned to the token sale 
     */
    constructor(MikaCoin _coinContract, uint256 _coinPrice) {
        admin = msg.sender;
        coinContract = _coinContract;
        coinPrice = _coinPrice;
    }

    /**
     * function taken from ds-math on github
     */
    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
    

    /**
     * @dev allows address to purchase tokens
     * 
     * @param _coinsPurchaseAmount number of tokens to be purchased
     */
    function buyCoins(uint256 _coinsPurchaseAmount) public payable {

        // buy tokens for correct amount of wei
        //require(msg.value == mul(_coinsPurchaseAmount, coinPrice), "incorrect amount of wei");  // need function to handle safe multiplication
        // require the contract has enough tokens 
        require(coinContract.balanceOf(address(this)) >= _coinsPurchaseAmount, "contract balance < amount requested to purchase");
        // transfer tokens to caller address
        require(coinContract.transfer(payable(msg.sender), _coinsPurchaseAmount));

        coinsSold += _coinsPurchaseAmount;

        emit Sell(msg.sender, _coinsPurchaseAmount);
    }

    /**
     * @dev allows admin to end token sale 
     * 
     */
    function endSale() public {
        require(msg.sender == admin, 'Must be admin to end token sale');
        require(coinContract.transfer(admin, coinContract.balanceOf(address(this))), 'Could not transfer tokens to admin');
    }
}