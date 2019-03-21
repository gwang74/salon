// const web3 = require('web3');
// const BigNumber = require('bignumber.js');
const SalonTokenImpl = artifacts.require('SalonTokenImpl');
const SalonTokenStorage = artifacts.require('SalonTokenStorage');
const SalonToken = artifacts.require('SalonToken');
const assertRevert = require('../helpers/assertRevert');
const zeroAccount = require('../helpers/zeroAccount');

contract('SalonToken', (accounts) => {
    let token;
    let storage;

    beforeEach(async () => {
        token = await SalonToken.new("AnHui Blockchain Salon Token", "AHBC", 18);
    });

    it('Get name/symbol/totalSupply test', async () => {
        let name = await token.name.call();
        assert.equal(name, 'AnHui Blockchain Salon Token');

        let symbol = await token.symbol.call();
        assert.equal(symbol, 'AHBC');

        let total = await token.totalSupply.call();
        assert.equal(total.toString(), web3.utils.toWei('0').toString());

        let decimals = await token.decimals.call();
        assert.equal(decimals.toString(), '18');
    });

    it('Test transfer/balanceOf', async () => {
        let src = accounts[0];
        let dst = accounts[1];
        let {mint_ret} = await token.mint(src, web3.utils.toWei('10').toString());

        const {logs} = await token.transfer(dst, web3.utils.toWei('3.3').toString(), {from: src});
        const transferEvent = logs.find(e => e.event === 'Transfer');
        assert.notEqual(transferEvent, undefined);

        const srcBalance = await token.balanceOf(src);
        const dstBalance = await token.balanceOf(dst);
        assert.equal(web3.utils.fromWei(srcBalance).toString(), '6.7');
        assert.equal(web3.utils.fromWei(dstBalance).toString(), '3.3');
    });

    it('Test transferByAdministrator', async () => {
        let src = accounts[0];
        let dst = accounts[1];
        await token.mint(src, web3.utils.toWei('10').toString());

        assert.equal(web3.utils.fromWei(await token.balanceOf(src)).toString(), '10');
        const {logs} = await token.transferByAdministrator(src, dst, web3.utils.toWei('3.3'));
        const transferEvent = logs.find(e => e.event === 'Transfer');
        assert.notEqual(transferEvent, undefined);

        assert.equal(web3.utils.fromWei(await token.balanceOf(src)).toString(), '6.7');
        assert.equal(web3.utils.fromWei(await token.balanceOf(dst)).toString(), '3.3');

        //除了salon合约之外，不能代理别人转账
        assertRevert(token.transferByAdministrator(src, dst, web3.utils.toWei('3.3'), {from: accounts[3]}));
    });

    it('Test transferFrom/approval/allowance', async () => {
        let src = accounts[0];
        let dst = accounts[1];
        let spender = accounts[2];
        let approval = accounts[3];

        let {mint_ret} = await token.mint(src, web3.utils.toWei('10').toString());

        await token.transfer(approval, web3.utils.toWei('6.7').toString(), {from: src});

        let approval_logs = await token.approve(spender, web3.utils.toWei('6.7').toString(), {from: approval});
        const approvalEvent = approval_logs.logs.find(e => e.event === 'Approval');
        assert.notEqual(approvalEvent, undefined);

        let approvalNumber = await token.allowance.call(approval, spender, {from: dst});
        assert.equal(web3.utils.fromWei(approvalNumber).toString(), '6.7');

        let transfer_logs = await token.transfer(dst, web3.utils.toWei('3.3').toString(), {from: src});
        const transferEvent = transfer_logs.logs.find(e => e.event === 'Transfer');
        assert.notEqual(transferEvent, undefined);

        let from_logs = await token.transferFrom(approval, dst, web3.utils.toWei('3.3').toString(), {from: spender});
        const transferFromEvent = from_logs.logs.find(e => e.event === 'Transfer');
        assert.notEqual(transferFromEvent, undefined);

        approvalNumber = await token.allowance.call(approval, spender, {from: dst});
        assert.equal(web3.utils.fromWei(approvalNumber).toString(), '3.4');

        const srcBalance = await token.balanceOf(src);
        const dstBalance = await token.balanceOf(dst);
        const approvalBalance = await token.balanceOf(approval);
        const spenderBalance = await token.balanceOf(spender);
        // console.log(srcBalance.toString(), dstBalance.toString(), approvalBalance.toString(), spenderBalance.toString());
        assert.equal(web3.utils.fromWei(srcBalance).toString(), '0');
        assert.equal(web3.utils.fromWei(dstBalance).toString(), '6.6');
        assert.equal(web3.utils.fromWei(approvalBalance).toString(), '3.4');
        assert.equal(web3.utils.fromWei(spenderBalance).toString(), '0');

        // console.log((await token.tokenStorage.call()), (await token.tokenImpl.call()));
    });

    it('Upgrade test', async () => {
        let storageAddress = await token.tokenStorage.call();
        let tokenImpl = await SalonTokenImpl.new(storageAddress, 18);

        await tokenImpl.transferAdministrator(token.address);
        let upgrade_logs = await token.upgrade(tokenImpl.address);
        const upgradeEvent = upgrade_logs.logs.find(e => e.event === 'Upgrade');
        assert.notEqual(upgradeEvent, undefined);

        let name = await token.name.call();
        assert.equal(name, 'AnHui Blockchain Salon Token');
    });

    it('Upgrade with new storage test', async () => {
        let newStorage = await SalonTokenStorage.new();
        await newStorage.setName("JiangShu Blockchain Salon Token");
        await newStorage.setSymbol("JSBC");
        await newStorage.setDecimals(18);
        await newStorage.setTotalSupply(web3.utils.toWei('0'));

        let tokenImpl = await SalonTokenImpl.new(newStorage.address, 18);

        await tokenImpl.transferAdministrator(token.address);
        let upgrade_logs = await token.upgrade(tokenImpl.address);
        const upgradeEvent = upgrade_logs.logs.find(e => e.event === 'Upgrade');
        assert.notEqual(upgradeEvent, undefined);

        await newStorage.transferAdministrator(tokenImpl.address);
        let name = await token.name.call();
        assert.equal(name, 'JiangShu Blockchain Salon Token');
    });
});
