const MikaCoin = artifacts.require("MikaCoin");

const TOKEN_NAME = "MikaCoin";
const TOKEN_SYMBOL = "MKC";
const TOTAL_SUPPLY = 1000000;

module.exports = function (deployer) {
  deployer.deploy(MikaCoin, TOKEN_NAME, TOKEN_SYMBOL, TOTAL_SUPPLY);
};
