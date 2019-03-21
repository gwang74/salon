const Salon = artifacts.require('Salon');
const SalonToken = artifacts.require('SalonToken');
const assertRevert = require('../helpers/assertRevert');
const zeroAccount = require('../helpers/zeroAccount');

contract('Salon', (accounts) => {
    let salon;
    let token;

    beforeEach(async () => {
        token = await SalonToken.new("AnHui Blockchain Salon Token", "AHBC", 18);
        salon = await Salon.new(token.address);
        await token.transferAdministrator(salon.address); //这里要加await，否则后面运行太快，导致交易发生在转管理员之前，容易出现时而报错时而不报错的情况
    });

    it('Create new Campaign test', async () => {
        let admin = accounts[0];
        let speaker = accounts[1];
        let sponsor = accounts[2];
        let newCampaign_logs = await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
        const LogNewCampaignEvent = newCampaign_logs.logs.find(e => e.event === 'LogNewCampaign');
        assert.notEqual(LogNewCampaignEvent, undefined);
    });

    it('Create new Campaign with invalid speaker and sponsor test', async () => {
        let admin = accounts[0];
        let speaker = accounts[1];
        let sponsor = accounts[2];

        await assertRevert(salon.newCampaign(20180901, "区块链开发介绍", zeroAccount, sponsor));
        await assertRevert(salon.newCampaign(20180901, "区块链开发介绍", speaker, zeroAccount));

        let newCampaign_logs = await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
        const LogNewCampaignEvent = newCampaign_logs.logs.find(e => e.event === 'LogNewCampaign');
        assert.notEqual(LogNewCampaignEvent, undefined);

        await assertRevert(salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor));
    });

    it('register test', async () => {
        let admin = accounts[0];
        let speaker = accounts[1];
        let sponsor = accounts[2];
        let participant = accounts[3];

        // 报名需要资金和授权
        await token.mint(admin, web3.utils.toWei('100').toString());
        await token.transfer(participant, web3.utils.toWei('10').toString());

        let newCampaign_logs = await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
        const LogNewCampaignEvent = newCampaign_logs.logs.find(e => e.event === 'LogNewCampaign');
        assert.notEqual(LogNewCampaignEvent, undefined);

        let register_logs = await salon.register(20180901, {from: participant});
        let RegisterEvent = register_logs.logs.find(e => e.event === 'LogRegister');
        assert.notEqual(RegisterEvent, undefined);

        let adminBalance = await token.balanceOf(admin);
        let salonBalance = await token.balanceOf(salon.address);
        let participantBalance = await token.balanceOf(participant);
        assert.equal(web3.utils.fromWei(adminBalance).toString(), '90');
        assert.equal(web3.utils.fromWei(salonBalance).toString(), '101');
        assert.equal(web3.utils.fromWei(participantBalance).toString(), '9');

        //重复报名
        assertRevert(salon.register(20180901, {from: participant}));
    });

    it('Checkin test', async () => {
        let admin = accounts[0];
        let speaker = accounts[1];
        let sponsor = accounts[2];
        let participant = accounts[3];

        // 报名需要资金和授权
        await token.mint(admin, web3.utils.toWei('100').toString());
        await token.transfer(participant, web3.utils.toWei('10').toString());
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: participant});

        await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
        await salon.register(20180901, {from: participant});

        let checkin_logs = await salon.checkin(20180901, participant);
        let CheckinEvent = checkin_logs.logs.find(e => e.event === 'LogCheckedIn');
        assert.notEqual(CheckinEvent, undefined);

        //重复签到，没有消息
        assertRevert(salon.checkin(20180901, participant));
    });

    it('Add question test', async () => {
        let admin = accounts[0];
        let speaker = accounts[1];
        let sponsor = accounts[2];
        let participant = accounts[3];
        let questioner = accounts[4];
        let replier = accounts[5];

        // 报名需要资金和授权
        await token.mint(admin, web3.utils.toWei('100').toString());
        await token.transfer(participant, web3.utils.toWei('10').toString());
        await token.transfer(questioner, web3.utils.toWei('10').toString());
        await token.transfer(replier, web3.utils.toWei('10').toString());
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: participant});
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: questioner});
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: replier});

        await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
        await salon.register(20180901, {from: participant});
        await salon.register(20180901, {from: questioner});
        await salon.register(20180901, {from: replier});

        await salon.checkin(20180901, participant);
        await salon.checkin(20180901, questioner);
        await salon.checkin(20180901, replier);

        let question_logs = await salon.addQuestion(20180901, questioner, replier);
        let QuestionEvent = question_logs.logs.find(e => e.event === 'LogQuestion');
        assert.notEqual(QuestionEvent, undefined);
    });

    it('Salon mining test', async () => {
        let admin = accounts[0];
        let speaker = accounts[1];  //30
        let sponsor = accounts[2];  //10
        let participant = accounts[3];
        let questioner = accounts[4];
        let replier = accounts[5];

        // 报名需要资金和授权
        await token.mint(admin, web3.utils.toWei('100').toString());
        await token.transfer(participant, web3.utils.toWei('10').toString());
        await token.transfer(questioner, web3.utils.toWei('10').toString());
        await token.transfer(replier, web3.utils.toWei('10').toString());
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: admin});
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: participant});
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: questioner});
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: replier});

        await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
        await salon.register(20180901, {from: admin});
        await salon.register(20180901, {from: participant});
        await salon.register(20180901, {from: questioner});
        await salon.register(20180901, {from: replier});

        await salon.checkin(20180901, admin);
        await salon.checkin(20180901, participant);
        await salon.checkin(20180901, questioner);
        await salon.checkin(20180901, replier);

        await salon.addQuestion(20180901, questioner, replier);

        assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '104');

        let close_logs = await salon.closeCampaign(20180901);
        let CloseEvent = close_logs.logs.find(e => e.event === 'LogClose');
        assert.notEqual(CloseEvent, undefined);

        assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '0');
        assert.equal(web3.utils.fromWei((await token.balanceOf(speaker))).toString(), '31.2');
        assert.equal(web3.utils.fromWei((await token.balanceOf(sponsor))).toString(), '10.4');
        assert.equal(web3.utils.fromWei((await token.balanceOf(admin))).toString(), '79.4');
        assert.equal(web3.utils.fromWei((await token.balanceOf(participant))).toString(), '19.4');
        assert.equal(web3.utils.fromWei((await token.balanceOf(questioner))).toString(), '29.8');
        assert.equal(web3.utils.fromWei((await token.balanceOf(replier))).toString(), '29.8');
    });

    it('Salon mining without question test', async () => {
        let admin = accounts[0];
        let speaker = accounts[1];  //30
        let sponsor = accounts[2];  //10
        let participant = accounts[3];
        let questioner = accounts[4];
        let replier = accounts[5];

        // 报名需要资金和授权
        await token.mint(admin, web3.utils.toWei('100').toString());
        await token.transfer(participant, web3.utils.toWei('10').toString());
        await token.transfer(questioner, web3.utils.toWei('10').toString());
        await token.transfer(replier, web3.utils.toWei('10').toString());
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: admin});
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: participant});
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: questioner});
        await token.approve(salon.address, web3.utils.toWei('1').toString(), {from: replier});

        await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
        await salon.register(20180901, {from: admin});
        await salon.register(20180901, {from: participant});
        await salon.register(20180901, {from: questioner});
        await salon.register(20180901, {from: replier});

        await salon.checkin(20180901, admin);
        await salon.checkin(20180901, participant);
        await salon.checkin(20180901, questioner);
        await salon.checkin(20180901, replier);

        assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '104');

        let close_logs = await salon.closeCampaign(20180901);
        let CloseEvent = close_logs.logs.find(e => e.event === 'LogClose');
        assert.notEqual(CloseEvent, undefined);

        // 剩余的用于下次分配
        assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '20.8');

        assert.equal(web3.utils.fromWei((await token.balanceOf(speaker))).toString(), '31.2');
        assert.equal(web3.utils.fromWei((await token.balanceOf(sponsor))).toString(), '10.4');
        assert.equal(web3.utils.fromWei((await token.balanceOf(admin))).toString(), '79.4');
        assert.equal(web3.utils.fromWei((await token.balanceOf(participant))).toString(), '19.4');
        assert.equal(web3.utils.fromWei((await token.balanceOf(questioner))).toString(), '19.4');
        assert.equal(web3.utils.fromWei((await token.balanceOf(replier))).toString(), '19.4');
    });

    it('Salon mining with multiple checkin test', async () => {
        let admin = accounts[0];
        let speaker = accounts[1];  //30
        let sponsor = accounts[2];  //10
        let participant = accounts[3];
        let questioner = accounts[4];
        let replier = accounts[5];

        // 报名需要资金和授权
        await token.mint(admin, web3.utils.toWei('100').toString());
        await token.transfer(participant, web3.utils.toWei('10').toString());
        await token.transfer(questioner, web3.utils.toWei('10').toString());
        await token.transfer(replier, web3.utils.toWei('10').toString());

        await salon.newCampaign(20180901, "区块链开发介绍", speaker, sponsor);
        await salon.register(20180901, {from: admin});
        await salon.register(20180901, {from: participant});
        await salon.register(20180901, {from: questioner});
        await salon.register(20180901, {from: replier});

        await salon.checkin(20180901, admin);
        await salon.checkin(20180901, participant);
        assertRevert(salon.checkin(20180901, participant));
        await salon.checkin(20180901, questioner);
        await salon.checkin(20180901, replier);

        assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '104');

        let close_logs = await salon.closeCampaign(20180901);
        let CloseEvent = close_logs.logs.find(e => e.event === 'LogClose');
        assert.notEqual(CloseEvent, undefined);

        assert.equal(web3.utils.fromWei((await token.balanceOf(salon.address))).toString(), '20.8');

        assert.equal(web3.utils.fromWei((await token.balanceOf(speaker))).toString(), '31.2');
        assert.equal(web3.utils.fromWei((await token.balanceOf(sponsor))).toString(), '10.4');
        assert.equal(web3.utils.fromWei((await token.balanceOf(participant))).toString(), '19.4', "重复签到不会重复计入挖矿，应该是19.4");
    });

    //TODO:提问人一定是参会报名的人员，以及主持人，赞助商
});
