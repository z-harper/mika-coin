const MikaCoin = artifacts.require('./MikaCoin.sol');

const TOKEN_NAME = "MikaCoin";
const TOKEN_SYMBOL = "MKC";
const TOTAL_SUPPLY = 1000000;

// Check name of coin
contract('MikaCoin', () => {
  it('set name upon deployment', () => {
    return MikaCoin.deployed().then(i => {
      contract = i;
      return contract.name()
    })
    .then((name) => {
      assert.equal(name, TOKEN_NAME, 'Sets name of coin to MikaCoin')
    })
  })
})

// Check symbol of coin
contract('MikaCoin', () => {
  it('set symbol upon deployment', () => {
    return MikaCoin.deployed().then(i => {
      contract = i;
      return contract.symbol()
    })
    .then((symbol) => {
      assert.equal(symbol, TOKEN_SYMBOL, 'Sets symbol of coin to MKC')
    })
  })
})

// Check total supply of coin
contract('MikaCoin', () => {
  it('set total supply upon deployment', () => {
    return MikaCoin.deployed().then(i => {
      contract = i;
      return contract.totalSupply()
    })
    .then((supply) => {
      assert.equal(supply, TOTAL_SUPPLY, 'Sets total supply of coin to 1000000')
    })
  })
})
