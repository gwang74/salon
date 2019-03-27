// import Contract from "truffle-contract"
// import salonContract from "../../../contract/build/contracts/Salon.json";
import tp from "tp-js-sdk";

const Salon = {
  // contract: null,

  instance: null,

  fromAddress: null,

  init: async function () {
    let self = this;
    let admin;

    // self.contract = Contract(salonContract);
    // self.contract.setProvider(window.web3.currentProvider);
    // let fromAccount = web3.currentProvider.selectedAddress
    // self.contract.defaults({
    //   from: "0xa0eaf3ddbcf690f5f08f374b6fe01c71ff8dc54c"
    // })
    // self.instance = await self.contract.deployed()
    // self.cInstance = await self.contract.at('0x5a8347056c9712994a694A27d3b017eEc7a60e40')

    const res = await tp.getCurrentWallet();
    self.fromAddress = res.data.address;
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      self.instance = chain3.mc.contract(JSON.parse(process.env.VUE_APP_SALONABI)).at(process.env.VUE_APP_SALON_ADDRESS_MOAC);
      admin = await self.instance.administrator.call();
    } else {
      self.instance = new web3.eth.Contract(JSON.parse(process.env.VUE_APP_SALONABI), process.env.VUE_APP_SALON_ADDRESS);
      admin = await self.instance.methods.administrator().call();
    }
    return admin === self.fromAddress;
  },

  newCampaign: async function (campaignID, topic, speaker, sponsor) {
    let self = this;
    let data;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      data = self.instance.newCampaign.getData(campaignID, topic, speaker, sponsor);
    } else {
      data = self.instance.methods.newCampaign(campaignID, topic, speaker, sponsor).encodeABI();
    }
    console.log(self.fromAddress);
    let transaction = {
      from: self.fromAddress,
      to: process.env.VUE_APP_SALON_ADDRESS,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      data: data
    };
    console.log(transaction);
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
      to: process.env.VUE_APP_SALON_ADDRESS,
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
      to: process.env.VUE_APP_SALON_ADDRESS,
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
      to: process.env.VUE_APP_SALON_ADDRESS,
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
      to: process.env.VUE_APP_SALON_ADDRESS,
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
      to: process.env.VUE_APP_SALON_ADDRESS,
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