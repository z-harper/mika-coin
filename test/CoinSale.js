const CoinSale = artifacts.require('./CoinSale.sol');
const MikaCoin = artifacts.require('./MikaCoin.sol');


contract('CoinSale', accounts => {
  let coinSaleContract;
  let mikaCoinContract;
  let coinPrice = 1000000000000000;  // in wei 15>0s == 0.001 ETH
  let buyer = accounts[1];
  let admin = accounts[0];  // able to transfer tokens
  let coinsAvailable = 750000;
  let numberOfCoins = 10;  // how many coins to be purchased
  let value = numberOfCoins * coinPrice; // how much wei we want to send

  it('initialize contract with correct values', () => {
    return CoinSale.deployed().then(i => {
      coinSaleContract = i;
      return coinSaleContract.address;
    })
    .then(address => {
      // check to see that address is present
      assert.notEqual(address, 0x0, 'contract address present')
      return coinSaleContract.coinContract();
    })
    .then(address => {
      // check that a reference to MikaCoin exists in CoinSale 
      assert.notEqual(address, 0x0, 'MikaCoin contract address present')
      return coinSaleContract.coinPrice();
    })
    .then(price => {
      // verify token price 
      assert.equal(price, coinPrice, 'price is correct')
    })
  })

  // coin purchasing
  it('token buying', () => {
    return MikaCoin.deployed().then(i => {
      mikaCoinContract = i;
      return CoinSale.deployed()
    })
    .then(i => {
      coinSaleContract = i;
      // provision MikaCoins to CoinSale contract
      return mikaCoinContract.transfer(coinSaleContract.address, coinsAvailable, { from: admin });
    })
    .then(receipt => {
      // value is how much wei we want to send
      let value = numberOfCoins * coinPrice;
      return coinSaleContract.buyCoins(numberOfCoins, { from: buyer, value: value });
    })
    .then(receipt => {
      // track amount of tokens sold by triggering sell event
      // must emit an event in solidity contract for us to get a receipt.
      // .args._buyer and .args._seller or params in event Sell()
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased coins');
      assert.equal(receipt.logs[0].args._amount, numberOfCoins, 'logs the purchase amount');
      return coinSaleContract.coinsSold();
    })
    .then(amount => {
      // verify sold and purchase amounts equal
      assert.equal(amount, numberOfCoins, 'number of coins sold === number of coins bought')
      // check balance of buyer
      return mikaCoinContract.balanceOf(buyer);
    })
    .then(balance => {
      // verify sold and purchase amounts equal
      assert.equal(balance, numberOfCoins, 'check that buyer has received coins')
      // check balance of CoinSale
      return mikaCoinContract.balanceOf(coinSaleContract.address);
    })
    .then(balance => {
      // verify sold and purchase amounts equal
      assert.equal(balance, coinsAvailable - numberOfCoins, 'coinsale coins reduced by amount purchased')
      // try to buy 10 tokens for 1 wei (buyer is trying to underpay)
      //return coinSaleContract.buyCoins(numberOfCoins, { from: buyer, value: 1 });
    })

    // .then(assert.fail)
    // .catch(error => {
    //   assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
    //   // try to buy more MikaCoins than are available in the contract
    //   //return coinSaleContract.buyCoins(5000000, { from: buyer, value: 5000000 * coinPrice });
    // })
    // .then(assert.fail)
    // .catch(error => {
    //   assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
    //   // try to buy more MikaCoins than are available in the contract
    //   return coinSaleContract.buyCoins(5000000, { from: buyer, value: 5000000 * coinPrice });
    // })  
  })

})