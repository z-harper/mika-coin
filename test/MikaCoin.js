const MikaCoin = artifacts.require('./MikaCoin.sol');

const TOKEN_NAME = "MikaCoin";
const TOKEN_SYMBOL = "MKC";
const INITIAL_SUPPLY = 1000000;

contract('MikaCoin', (accounts) => {
  // Check name of coin
  it('set name upon deployment', () => {
    return MikaCoin.deployed().then(i => {
      contract = i;
      return contract.name()
    })
    .then((name) => {
      assert.equal(name, TOKEN_NAME, 'Sets name of coin to MikaCoin')
    })
  })

  // Check symbol of coin
  it('set symbol upon deployment', () => {
    return MikaCoin.deployed().then(i => {
      contract = i;
      return contract.symbol()
    })
    .then((symbol) => {
      assert.equal(symbol, TOKEN_SYMBOL, 'Sets symbol of coin to MKC')
    })
  })

  // Check total supply of coin and ensure that tokens are sent to contract creator
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

  // Transfer function tests
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

  // Approve tokens for transfer from accounts[1] for 100 tokens 
  it('approves tokens for delegated transfer from owner', () => {
    return MikaCoin.deployed().then(i => { 
      contract = i;
      return contract.approve.call(accounts[1], 100);
    })
    .then(success => {
      assert.equal(success, true, 'it returns true');
      // approving accounts[1] to spend 100 MikaCoins on accounts[0] behalf
      return contract.approve(accounts[1], 100, { from: accounts[0] });
    })
    .then(receipt => {
      // inpsect receipt. can look at logs in remix after a transfer to see args
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
      assert.equal(receipt.logs[0].args.owner, accounts[0], 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args.spender, accounts[1], 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args.value, 100, 'logs the transfer amount');
      return contract.allowance(accounts[0], accounts[1]);
    })
    .then(allowance => {
      assert.equal(allowance, 100, 'stores the allowance for delegated transfer')
    })
  })

  // need to track 3 accts: caller, sending to, sending from
  it('handles delegated transfer from owner', () => {
    return MikaCoin.deployed().then(i => {
      contract = i;
      fromAccount = accounts[2];
      toAccount = accounts[3];
      spendingAccount = accounts[4];
      // transfer tokens to fromAccount 
      return contract.transfer(fromAccount, 100, { from: accounts[0] })
    })
    .then(receipt => {
      // approve spendingAccount to spend 10 tokens from fromAccount
      return contract.approve(spendingAccount, 10, { from: fromAccount })
    })
    .then(receipt => {
      // try transferring a larger amount than sender's balance
      return contract.transferFrom(fromAccount, toAccount, 200, { from: spendingAccount })
    })
    .then(assert.fail)
    .catch(error => {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance held')
      // try transferring something larger than approved amount
      return contract.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount })
    })
    .then(assert.fail)
    .catch(error => {
      assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount')
      // call a vaild  transaction
      return contract.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount })
    })
    .then(success => {
      assert.equal(success, true);
      // actually call the function with a valid transaction so can verify account balances
      return contract.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount })
    })
    .then(receipt => {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Approval" event');
      assert.equal(receipt.logs[0].args.from, fromAccount, 'logs the account the tokens are transferred from');
      assert.equal(receipt.logs[0].args.to, toAccount, 'logs the account the tokens are transferred to');
      assert.equal(receipt.logs[0].args.value, 10, 'logs the transfer amount');
      // see if transfer did what we expected 
      return contract.balanceOf(fromAccount);
    })
    .then(bal => {
      assert.equal(bal, 90, 'deducts the amount from sending account');
      return contract.balanceOf(toAccount);
    })
    .then(bal => {
      assert.equal(bal, 10, 'adds the amount to receiving account');
      return contract.allowance(fromAccount, spendingAccount);
    })
    .then(allowance => {
      assert.equal(allowance, 0, 'deducts the amount from the allowance')
    })
  })

})

