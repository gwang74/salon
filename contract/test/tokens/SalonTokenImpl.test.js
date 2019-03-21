// const web3 = require('web3');
// const BigNumber = require('bignumber.js');
const SalonTokenImpl = artifacts.require('SalonTokenImpl');
const SalonTokenStorage = artifacts.require('SalonTokenStorage');
const assertRevert = require('../helpers/assertRevert');
const zeroAccount = require('../helpers/zeroAccount');

contract('SalonTokenImpl', (accounts) => {
  let tokenImpl;
  let storage;

  beforeEach(async () => {
    storage = await SalonTokenStorage.new();
    await storage.setName("AnHui Blockchain Salon Token");
    await storage.setSymbol("AHBC");
    await storage.setDecimals(18);
    //超过10的20次方就变成科学计数法会失败
    await storage.setTotalSupply(web3.utils.toWei('0'));
    
    tokenImpl = await SalonTokenImpl.new(storage.address, 18);
    await storage.transferAdministrator(tokenImpl.address);

  });

  it('Get name/symbol/totalSupply test', async () => {
    let name = await tokenImpl.name.call();
    assert.equal(name, 'AnHui Blockchain Salon Token');

    let symbol = await tokenImpl.symbol.call();
    assert.equal(symbol, 'AHBC');

    let total = await tokenImpl.totalSupply.call();
    assert.equal(total.toString(), web3.utils.toWei('0').toString());

    let decimals = await tokenImpl.decimals.call();
    assert.equal(decimals.toString(), '18');
  });

  it('Test transfer/balanceOf', async () => {
    let src = accounts[0];
    let dst = accounts[1];
    let {mint_ret} = await tokenImpl.mint(src, web3.utils.toWei('10').toString());
    // console.log('mint ret:', mint_ret);

    const { logs } = await tokenImpl.transfer(src, dst, web3.utils.toWei('3.3').toString());
    const transferEvent = logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    const srcBalance = await tokenImpl.balanceOf(src);
    const dstBalance = await tokenImpl.balanceOf(dst);
    assert.equal(web3.utils.fromWei(srcBalance).toString(), '6.7');
    assert.equal(web3.utils.fromWei(dstBalance).toString(), '3.3');
  });

  it('Test transferFrom/approval/allowance', async () => {
    let src = accounts[0];
    let dst = accounts[1];
    let spender = accounts[2];
    let approval = accounts[3];

    let {mint_ret} = await tokenImpl.mint(src, web3.utils.toWei('10').toString());
    // console.log('mint ret:', mint_ret);

    await tokenImpl.transfer(src, approval, web3.utils.toWei('6.7').toString());

    let approval_logs = await tokenImpl.approve(approval, spender, web3.utils.toWei('6.7').toString());
    const approvalEvent = approval_logs.logs.find(e => e.event === 'Approval');
    assert.notEqual(approvalEvent, undefined);

    let approvalNumber = await tokenImpl.allowance.call(approval, spender, {from: src});
    assert.equal(web3.utils.fromWei(approvalNumber).toString(), '6.7');

    let transfer_logs = await tokenImpl.transfer(src, dst, web3.utils.toWei('3.3').toString());
    const transferEvent = transfer_logs.logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferEvent, undefined);

    let from_logs = await tokenImpl.transferFrom(approval, spender, dst, web3.utils.toWei('3.3').toString(), {from: src});
    const transferFromEvent = from_logs.logs.find(e => e.event === 'Transfer');
    assert.notEqual(transferFromEvent, undefined);

    approvalNumber = await tokenImpl.allowance.call(approval, spender, {from: src});
    assert.equal(web3.utils.fromWei(approvalNumber).toString(), '3.4');

    const srcBalance = await tokenImpl.balanceOf(src);
    const dstBalance = await tokenImpl.balanceOf(dst);
    const approvalBalance = await tokenImpl.balanceOf(approval);
    const spenderBalance = await tokenImpl.balanceOf(spender);
    // console.log(srcBalance.toString(), dstBalance.toString(), approvalBalance.toString(), spenderBalance.toString());
    assert.equal(web3.utils.fromWei(srcBalance).toString(), '0');
    assert.equal(web3.utils.fromWei(dstBalance).toString(), '6.6');
    assert.equal(web3.utils.fromWei(approvalBalance).toString(), '3.4');
    assert.equal(web3.utils.fromWei(spenderBalance).toString(), '0');
  });
});
