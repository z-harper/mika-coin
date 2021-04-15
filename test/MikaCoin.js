const MikaCoin = artifacts.require('./MikaCoin.sol');

const TOKEN_NAME = "MikaCoin";
const TOKEN_SYMBOL = "MKC";
const INITIAL_SUPPLY = 1000000;

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

// Check total supply of coin and ensure that tokens are sent to contract creator
contract('MikaCoin', (accounts) => {
  let contract;

  it('set total supply upon deployment', () => {
    return MikaCoin.deployed().then(i => {
      contract = i;
      return contract.totalSupply()
    })
    .then((supply) => {
      assert.equal(supply, INITIAL_SUPPLY, 'Sets total supply of coin to 1000000');
      return contract.balanceOf(accounts[0]);
    })
    .then((adminSupply) => {
      assert.equal(adminSupply, INITIAL_SUPPLY, 'Allocates supply of tokens to contract creator');
    })
  })
})

// Transfer function tests
contract('MikaCoin', (accounts) => {
  it('verify transfers from one account to another', () => {
    return MikaCoin.deployed().then(i => {
      contract = i;
      // Test `require` statement first by transferring an amount of tokens > sender's bal
      return contract.transfer.call(accounts[1], 999999999);
    })
    .then(assert.fail)
    .catch(error => {
      assert(error.message.indexOf('revert') >= 0, 'error msg must contain revert');
      return contract.transfer(accounts[1], 2500, { from: accounts[0] });
    })
    .then(receipt => {
      // inpsect receipt. can look at logs in remix after a transfer to see args
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args.from, accounts[0], 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args.to, accounts[1], 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args.value, 2500, 'logs the transfer amount');
      return contract.balanceOf(accounts[1]);
    })
    .then(bal => {
      // check balance of receiving account increased by amount sent
      assert.equal(bal, 2500, 'Amount transfered to receiving account');
      return contract.balanceOf(accounts[0]);
    })
    // check balance of sending account decreased by amount sent
    .then(bal => {
      assert.equal(bal, 997500, 'Amount transfered out of sending account');
    })
  })
})
