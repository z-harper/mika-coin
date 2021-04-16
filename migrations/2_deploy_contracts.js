const MikaCoin = artifacts.require("MikaCoin");
const CoinSale = artifacts.require("CoinSale");

const TOKEN_NAME = "MikaCoin";
const TOKEN_SYMBOL = "MKC";
const INITIAL_SUPPLY = 1000000;
const TOKEN_PRICE = 1000000000000000;

module.exports = function (deployer) {
  deployer.deploy(MikaCoin, TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY)
    .then(() => {
      return deployer.deploy(CoinSale, MikaCoin.address, TOKEN_PRICE);
    });
  
};
