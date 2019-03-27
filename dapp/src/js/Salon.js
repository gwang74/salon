// import Contract from "truffle-contract"
// import salonContract from "../../../contract/build/contracts/Salon.json";
import tp from "tp-js-sdk";

const Salon = {
  // contract: null,

  instance: null,

  fromAddress: null,

  init: async function () {
    let self = this;

    // self.contract = Contract(salonContract);
    // self.contract.setProvider(window.web3.currentProvider);
    // let fromAccount = web3.currentProvider.selectedAddress
    // self.contract.defaults({
    //   from: "0xa0eaf3ddbcf690f5f08f374b6fe01c71ff8dc54c"
    // })
    // self.instance = await self.contract.deployed()
    // self.cInstance = await self.contract.at('0x5a8347056c9712994a694A27d3b017eEc7a60e40')

    // const abi = [{"constant":true,"inputs":[],"name":"registerFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x03f187ea"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"campaigns","outputs":[{"name":"ID","type":"uint256"},{"name":"end","type":"bool"},{"name":"topic","type":"string"},{"name":"speaker","type":"address"},{"name":"sponsor","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x141961bc"},{"constant":true,"inputs":[],"name":"speakerPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x3a6b94a9"},{"constant":true,"inputs":[],"name":"salonToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x81360cb1"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":true,"inputs":[],"name":"questionPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x9390b131"},{"constant":false,"inputs":[{"name":"newAdministrator","type":"address"}],"name":"transferAdministrator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc648a3a2"},{"constant":true,"inputs":[],"name":"participantPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xc7b0bdea"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf2fde38b"},{"constant":true,"inputs":[],"name":"administrator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf53d0a8e"},{"constant":true,"inputs":[],"name":"sponsorPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf6c391f1"},{"inputs":[{"name":"salonTokenAddr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"campaignID","type":"uint256"},{"indexed":false,"name":"topic","type":"string"},{"indexed":true,"name":"speaker","type":"address"},{"indexed":true,"name":"sponsor","type":"address"}],"name":"LogNewCampaign","type":"event","signature":"0xd572bb2db96d8e6a1d71f743a713a5a6fc72f80ab68be5785dd01f0a419868bc"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"}],"name":"LogRegister","type":"event","signature":"0x68f0f1b8c9e91743a8bf9b77af08d152d1cb9ac31eb5b472bf6e164672548855"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"}],"name":"LogCheckedIn","type":"event","signature":"0x1b2408a4115f70cb10cf5a6f58be73320ba1bfd7d86c3cef01e5a878491a085e"},{"anonymous":false,"inputs":[{"indexed":true,"name":"questioner","type":"address"},{"indexed":true,"name":"replier","type":"address"}],"name":"LogQuestion","type":"event","signature":"0xee71315e28a9fa2caba222c62872098c1b1055f6f80058dfe9e7000856be41b5"},{"anonymous":false,"inputs":[{"indexed":true,"name":"campaignID","type":"uint256"},{"indexed":false,"name":"numOfParticipants","type":"uint256"},{"indexed":false,"name":"questions","type":"uint256"}],"name":"LogClose","type":"event","signature":"0xc25bb76fa2c9cf400ad10e98a1ca12ec35e3f8d3b470b0b8c0af02a9ac71bb55"},{"constant":false,"inputs":[{"name":"_campaignID","type":"uint256"},{"name":"_topic","type":"string"},{"name":"_speaker","type":"address"},{"name":"_sponsor","type":"address"}],"name":"newCampaign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x17329ff2"},{"constant":false,"inputs":[{"name":"_speakerP","type":"uint256"},{"name":"_sponsorP","type":"uint256"},{"name":"_participantP","type":"uint256"},{"name":"_questionP","type":"uint256"}],"name":"changePercentage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xbfe995be"},{"constant":false,"inputs":[{"name":"_fee","type":"uint256"}],"name":"changeRegisterFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x91fb742a"},{"constant":false,"inputs":[{"name":"_campaignID","type":"uint256"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf207564e"},{"constant":false,"inputs":[{"name":"_campaignID","type":"uint256"},{"name":"_who","type":"address"}],"name":"checkin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf7aad18e"},{"constant":false,"inputs":[{"name":"_campaignID","type":"uint256"},{"name":"_questioner","type":"address"},{"name":"_replier","type":"address"}],"name":"addQuestion","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x18ba8c3f"},{"constant":false,"inputs":[{"name":"_campaignID","type":"uint256"}],"name":"closeCampaign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb0e1c1e1"}]
    const res = await tp.getCurrentWallet();
    self.fromAddress = res.data.address;
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      // const contract = chain3.mc.contract(abi);
      self.instance = chain3.mc.contract(JSON.parse(process.env.VUE_APP_SALONABI)).at('');
    } else {
      self.instance = new web3.eth.Contract(abi, process.env.VUE_APP_SALON_ADDRESS);
      // self.instance = new web3.eth.Contract(abi, "0x5a8347056c9712994a694A27d3b017eEc7a60e40", {
      //   from: self.fromAddress,
      //   gasPrice: "20000000000",
      //   gas: 8000000
      // });

      let admin = await self.instance.methods.administrator().call();
      return admin === self.fromAddress;
    }
  },

  newCampaign: async function (campaignID, topic, speaker, sponsor) {
    let self = this;
    let data;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.newCampaign.getData(campaignID, topic, speaker, sponsor);
    } else {
      data = self.instance.methods.newCampaign(campaignID, topic, speaker, sponsor).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: process.env.VUE_APP_SALONADDRESS,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      data: data
    };
    
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.signMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await chain3.mc.sendRawTransaction(res.data).catch(e => {
          console.log(e);
        });
        console.log(transaction);
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }

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
    let data;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.register.getData(campaignID);
    } else {
      data = self.instance.methods.register(campaignID).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: process.env.VUE_APP_SALONADDRESS,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.signMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await chain3.mc.sendRawTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }

  },

  checkin: async function (campaignID) {
    let self = this;
    let data;
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.checkin.getData(campaignID, self.instance.options.from);
    } else {
      data = self.instance.methods.checkin(campaignID, self.instance.options.from).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: process.env.VUE_APP_SALONADDRESS,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.signMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await chain3.mc.sendRawTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }
  },

  addQuestion: async function (campaignID, questioner, replier) {
    let self = this;
    let data;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.addQuestion.getData(campaignID, questioner, replier);
    } else {
      data = self.instance.methods.addQuestion(campaignID, questioner, replier).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: process.env.VUE_APP_SALONADDRESS,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.signMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await chain3.mc.sendRawTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }

  },

  changePercentage: async function (
    speakerP,
    sponsorP,
    participantP,
    questionP
  ) {
    let self = this;
    let data = self.instance.methods.changePercentage(speakerP, sponsorP, participantP, questionP).encodeABI();
    let transaction = {
      from: self.fromAddress,
      to: process.env.VUE_APP_SALONADDRESS,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      data: data
    };
    let res = await tp.signEthTransaction(transaction).catch(e => {
      console.log(e);
    });
    if (res.result) {
      let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
        console.log(e);
      });
      //transaction success
      if (web3.utils.hexToNumber(transaction.status) == 1) {
        return true;
      }
    }
  },

  closeCampaign: async function (campaignID) {
    let self = this;
    let data;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.closeCampaign.getData(campaignID);
    } else {
      data = self.instance.methods.closeCampaign(campaignID).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: process.env.VUE_APP_SALONADDRESS,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.signMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await chain3.mc.sendRawTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth.sendSignedTransaction(res.data).catch(e => {
          console.log(e);
        });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }
  },

  getSalonInfo: async function (campaignID) {
    let self = this;
    let res;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      res = await self.instance.campaigns.call(campaignID).catch(e => {
        console.log(e);
      });
    } else {
      res = await self.instance.methods.campaigns(campaignID).call().catch(e => {
        console.log(e);
      });
    }
    return res;
  },

  isAddress: function (address) {
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      return chain3.isAddress(address);
    }
    return web3.utils.isAddress(address);
  }
};

export default Salon;