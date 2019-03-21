pragma solidity ^0.5.0;

import "./IUpgradeable.sol";
import "./Administrative.sol";
import "./SalonToken.sol";

//沙龙合约，支持开启新活动，用户签到，问题记录以及奖励分配等功能
contract Salon is Administrative {

    //合约结构体
    struct Campaign {
        uint ID; //期号，建议用日期形式，例如20181116
        bool end; //是否结束
        string topic; //沙龙主题
        address speaker; //主讲人地址
        address sponsor; //赞助商（场地提供人）地址
        address[] participants; //参与者数组
        mapping(address => uint) idx_participants; //参与者状态：0表示未报名；1表示已报名；2表示已报名并且现场已签到
        address[] questioner; //提问者数组
        mapping(address => address) QRMap; //提问-回答键值对
    }

    mapping(uint => Campaign) public campaigns; //期号-沙龙实体键值对

    SalonToken public salonToken; //沙龙token合约
    uint unit; //沙龙token小数位数

    //一次沙龙活动挖矿的比例
    uint public speakerPercent = 30;
    uint public sponsorPercent = 10;
    uint public participantPercent = 40;
    uint public questionPercent = 20;
    uint public registerFee = 1;

    //构造函数，传入沙龙token合约地址
    constructor(address salonTokenAddr) public {
        salonToken = SalonToken(salonTokenAddr);
        uint decimals = salonToken.decimals();
        unit = 10 ** decimals;
    }

    //检测是否是合法沙龙，合法定义为：已经开始，但是没有结束的沙龙
    modifier validCampaign(uint _campaignID) {
        Campaign storage c = campaigns[_campaignID];
        require(c.speaker != address(0));
        require(!c.end);
        _;
    }

    //一些记录事件
    event LogNewCampaign(uint indexed campaignID, string topic, address indexed speaker, address indexed sponsor);
    event LogRegister(address indexed who);
    event LogCheckedIn(address indexed who);
    event LogQuestion(address indexed questioner, address indexed replier);
    event LogClose(uint indexed campaignID, uint numOfParticipants, uint questions);

    //开启一个新沙龙，需要管理员权限。根据既定规则，会产生100个新币，用于后期奖励。参数为：沙龙id，主题，主讲人，赞助商
    function newCampaign(uint _campaignID, string calldata _topic, address _speaker, address _sponsor)
    external onlyPrivileged {
        require(_speaker != address(0));
        require(_sponsor != address(0));
        require(campaigns[_campaignID].speaker == address(0)); //禁止重复的沙龙活动

        campaigns[_campaignID] = Campaign({
            ID : _campaignID, 
            end : false, 
            topic : _topic,
            speaker : _speaker, 
            sponsor : _sponsor, 
            participants : new address[](0), 
            questioner : new address[](0)
        });

        if(salonToken.totalSupply() + (100 * unit) <= (10000 * unit)) {
            salonToken.mint(address(this), 100 * unit);
        }

        emit LogNewCampaign(_campaignID, _topic, _speaker, _sponsor);
    }

    //修改各个部分的分配比例，需要管理员权限，参数为：主讲人比例，赞助商比例，参与者比例，提问回答者比例
    function changePercentage(uint _speakerP, uint _sponsorP, uint _participantP, uint _questionP)
    external onlyPrivileged{
        require(_speakerP + _sponsorP + _participantP + _questionP == 100, "比例总和要等于100");
        speakerPercent = _speakerP;
        sponsorPercent = _sponsorP;
        participantPercent = _participantP;
        questionPercent = _questionP;
    }

    function changeRegisterFee(uint _fee)
    external onlyPrivileged{
        require(_fee < 100, "报名费要低于挖矿数量");
        registerFee = _fee;
    }

    //用户报名，并缴纳报名费
    function register(uint _campaignID) external validCampaign(_campaignID) {
        Campaign storage c = campaigns[_campaignID];
        require(c.idx_participants[msg.sender] == 0, "已经完成报名");
        salonToken.transferByAdministrator(msg.sender, address(this), registerFee * unit);
        c.idx_participants[msg.sender] = 1;
        emit LogRegister(msg.sender);
    }

    //签到入场。参数为：沙龙id，签到人地址
    function checkin(uint _campaignID, address _who) external onlyPrivileged validCampaign(_campaignID){
        Campaign storage c = campaigns[_campaignID];
        require(c.idx_participants[_who] == 1, "尚未报名或已经签到成功");
        c.participants.push(_who);
        c.idx_participants[_who] = 2;
        emit LogCheckedIn(_who);
    }

    //添加场上问题。需要管理员权限，参数为：沙龙id，提问者，回答者
    function addQuestion(uint _campaignID, address _questioner, address _replier) external onlyPrivileged validCampaign(_campaignID) {
        Campaign storage c = campaigns[_campaignID];
        c.questioner.push(_questioner);
        c.QRMap[_questioner] = _replier;
        emit LogQuestion(_questioner, _replier);
    }

    //关闭沙龙。需要管理员权限。关闭后会按照既定规则，把奖励发放给主讲人、参与者等。参数为：沙龙id
    function closeCampaign(uint _campaignID) external onlyPrivileged validCampaign(_campaignID) {
        uint totalAmount = salonToken.balanceOf(address(this));

        Campaign storage c = campaigns[_campaignID];
        salonToken.transfer(c.speaker, speakerPercent * totalAmount / 100);
        salonToken.transfer(c.sponsor, sponsorPercent * totalAmount / 100);

        uint i;
        if(c.participants.length > 0) {
            uint tokenForAttendance = participantPercent * totalAmount / 100 / c.participants.length;
            for(i=0;i<c.participants.length;i++) {
                salonToken.transfer(c.participants[i], tokenForAttendance);
            }
        }

        if(c.questioner.length > 0) {
            uint tokenForQuestion = questionPercent * totalAmount / 100 / c.questioner.length / 2;
            for(i=0;i<c.questioner.length;i++) {
                salonToken.transfer(c.questioner[i], tokenForQuestion);
                salonToken.transfer(c.QRMap[c.questioner[i]], tokenForQuestion);
            }
        }

        c.end = true;
        emit LogClose(_campaignID, c.participants.length, c.questioner.length);
    }
}
