// import Contract from "truffle-contract"
// import salonContract from "../../../contract/build/contracts/Salon.json";
import Web3 from "web3";
import tp from "tp-js-sdk";

var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/2413e0137d6b4a3181d29c8f7727fcf6"));

const Salon = {
  // contract: null,

  instance: null,

  init: async function () {
    let self = this;

    // if (window.web3) {
    //   window.web3 = new Web3(web3.currentProvider);
    // } else {
      // window.web3 = new Web3(
      //   new Web3.providers.HttpProvider(
      //     "https://ropsten.infura.io/v3/2413e0137d6b4a3181d29c8f7727fcf6"
      //   )
      // );
    // }

    // self.contract = Contract(SalonContract)
    // self.contract.setProvider(window.web3.currentProvider)
    // let fromAccount = web3.currentProvider.selectedAddress
    // self.contract.defaults({
    //   from: "0xa0eaf3ddbcf690f5f08f374b6fe01c71ff8dc54c"
    // })
    // self.instance = await self.contract.deployed()
    // self.instance = await self.contract.at('0xa3e863F7efD9553531bCEe592fE4b040085CABF3')

    // const res = await tp.getCurrentWallet();
    // alert(res.data.address)
    const abi = [{"constant":true,"inputs":[],"name":"registerFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x03f187ea"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"campaigns","outputs":[{"name":"ID","type":"uint256"},{"name":"end","type":"bool"},{"name":"topic","type":"string"},{"name":"speaker","type":"address"},{"name":"sponsor","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x141961bc"},{"constant":true,"inputs":[],"name":"speakerPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x3a6b94a9"},{"constant":true,"inputs":[],"name":"salonToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x81360cb1"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":true,"inputs":[],"name":"questionPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x9390b131"},{"constant":false,"inputs":[{"name":"newAdministrator","type":"address"}],"name":"transferAdministrator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc648a3a2"},{"constant":true,"inputs":[],"name":"participantPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xc7b0bdea"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf2fde38b"},{"constant":true,"inputs":[],"name":"administrator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf53d0a8e"},{"constant":true,"inputs":[],"name":"sponsorPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf6c391f1"},{"inputs":[{"name":"salonTokenAddr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"campaignID","type":"uint256"},{"indexed":false,"name":"topic","type":"string"},{"indexed":true,"name":"speaker","type":"address"},{"indexed":true,"name":"sponsor","type":"address"}],"name":"LogNewCampaign","type":"event","signature":"0xd572bb2db96d8e6a1d71f743a713a5a6fc72f80ab68be5785dd01f0a419868bc"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"}],"name":"LogRegister","type":"event","signature":"0x68f0f1b8c9e91743a8bf9b77af08d152d1cb9ac31eb5b472bf6e164672548855"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"}],"name":"LogCheckedIn","type":"event","signature":"0x1b2408a4115f70cb10cf5a6f58be73320ba1bfd7d86c3cef01e5a878491a085e"},{"anonymous":false,"inputs":[{"indexed":true,"name":"questioner","type":"address"},{"indexed":true,"name":"replier","type":"address"}],"name":"LogQuestion","type":"event","signature":"0xee71315e28a9fa2caba222c62872098c1b1055f6f80058dfe9e7000856be41b5"},{"anonymous":false,"inputs":[{"indexed":true,"name":"campaignID","type":"uint256"},{"indexed":false,"name":"numOfParticipants","type":"uint256"},{"indexed":false,"name":"questions","type":"uint256"}],"name":"LogClose","type":"event","signature":"0xc25bb76fa2c9cf400ad10e98a1ca12ec35e3f8d3b470b0b8c0af02a9ac71bb55"},{"constant":false,"inputs":[{"name":"_campaignID","type":"uint256"},{"name":"_topic","type":"string"},{"name":"_speaker","type":"address"},{"name":"_sponsor","type":"address"}],"name":"newCampaign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x17329ff2"},{"constant":false,"inputs":[{"name":"_speakerP","type":"uint256"},{"name":"_sponsorP","type":"uint256"},{"name":"_participantP","type":"uint256"},{"name":"_questionP","type":"uint256"}],"name":"changePercentage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xbfe995be"},{"constant":false,"inputs":[{"name":"_fee","type":"uint256"}],"name":"changeRegisterFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x91fb742a"},{"constant":false,"inputs":[{"name":"_campaignID","type":"uint256"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf207564e"},{"constant":false,"inputs":[{"name":"_campaignID","type":"uint256"},{"name":"_who","type":"address"}],"name":"checkin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf7aad18e"},{"constant":false,"inputs":[{"name":"_campaignID","type":"uint256"},{"name":"_questioner","type":"address"},{"name":"_replier","type":"address"}],"name":"addQuestion","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x18ba8c3f"},{"constant":false,"inputs":[{"name":"_campaignID","type":"uint256"}],"name":"closeCampaign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb0e1c1e1"}]
    // self.instance = new web3.eth.Contract(abi,"0x5a8347056c9712994a694A27d3b017eEc7a60e40");
    alert(web3.version)
    console.log(web3.currentProvider)
    // try{
    //   let balance = await web3.eth.getBalance('0x8d137e376B784B7C3d9336e10f95311d4B123132')
    //   alert(balance)
    // }catch(e){
    //   alert("balance" + e)
    // }
    self.instance = new web3.eth.Contract(
      abi,
      "0x5a8347056c9712994a694A27d3b017eEc7a60e40", {
        from: "0x8d137e376B784B7C3d9336e10f95311d4B123132",
        gasPrice: "20000000000",
        gas: 8000000
      }
    );
    alert(self.instance)
  },

  newCampaign: async function (campaignID, topic, speaker, sponsor) {
    let self = this;
    const data = self.instance.methods
      .newCampaign(campaignID, topic, speaker, sponsor)
      .encodeABI();
    alert("encodeABI-->" + data);
    const transaction = {
      from: self.instance.options.from,
      to: self.instance.options.address,
      gasPrice: self.instance.options.gasPrice,
      gasLimit: self.instance.options.gas,
      data: data
    };
    alert(transaction);
    const res = await tp.signEthTransaction(transaction);
    alert(res);
    alert(res.result);
    alert(res.data);
    return res.result;
    // let newCampaign_logs = await self.instance.newCampaign(
    //   campaignID,
    //   topic,
    //   speaker,
    //   sponsor).catch(err => {
    //   console.log(err)
    // })
    // let LogNewCampaignEvent = newCampaign_logs.logs.find(
    //   e => e.event === "LogNewCampaign"
    // )
    // if (LogNewCampaignEvent) {
    //   return true
    // }
    // return false
  },

  register: async function (campaignID) {
    let self = this;
    let logRegister_logs = await self.instance.register(campaignID);
    let LogRegisterEvent = logRegister_logs.logs.find(
      e => e.event === "LogRegister"
    );
    if (LogRegisterEvent) {
      return true;
    }
    return false;
  },

  checkin: async function (campaignID) {
    let self = this;
    let address = web3.currentProvider.selectedAddress;
    let LogCheckedIn_logs = await self.instance.checkin(campaignID, address);
    let LogCheckedInEvent = LogCheckedIn_logs.logs.find(
      e => e.event === "LogCheckedIn"
    );
    if (LogCheckedInEvent) {
      return true;
    }
    return false;
  },

  changePercentage: async function (
    speakerP,
    sponsorP,
    participantP,
    questionP
  ) {
    let self = this;
    return await self.instance.changePercentage(
      speakerP,
      sponsorP,
      participantP,
      questionP
    );
  },

  closeCampaign: async function (campaignID) {
    let self = this;
    let close_logs = await self.instance.closeCampaign(campaignID);
    let CloseEvent = close_logs.logs.find(e => e.event === "LogClose");
    if (CloseEvent) {
      return true;
    }
    return false;
  },

  isStarting: async function (campaignID) {
    let self = this;
    let result = await self.instance.campaigns(campaignID);
    let id = web3.utils.fromWei(result.ID);

    return id == campaignID && !result;
  },

  isAddress: function (address) {
    return web3.utils.isAddress(address);
  },

  isAdministrator: async function () {
    let self = this;
    let admin = await self.instance.administrator();
    let fromAccount = web3.currentProvider.selectedAddress;
    return admin.toLowerCase() == fromAccount.toLowerCase();
  }
};

export default Salon;