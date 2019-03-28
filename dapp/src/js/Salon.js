// import Contract from "truffle-contract"
// import salonContract from "../../../contract/build/contracts/Salon.json";
import tp from "tp-js-sdk";

const Salon = {
  // contract: null,

  instance: null,

  fromAddress: null,

  toAddress: null,

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
      self.toAddress = process.env.VUE_APP_SALON_ADDRESS_MOAC;
      self.instance = chain3.mc.contract(JSON.parse(process.env.VUE_APP_SALONABI)).at(self.toAddress);
      admin = chain3.toChecksumAddress(self.instance.administrator());
    } else {
      self.toAddress = process.env.VUE_APP_SALON_ADDRESS;
      self.instance = new web3.eth.Contract(JSON.parse(process.env.VUE_APP_SALONABI), self.toAddress);
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

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: process.env.VUE_APP_CHAINID,
      data: data
    };
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.pushMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      console.log(res);
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.LogNewCampaign({
            campaignID: campaignID,
            topic: topic
          }, function (error, result) {
            if (!error) {
              resolve(true);
            } else {
              reject(false)
            }
          });
        });

        // const filter = self.instance.LogNewCampaign({
        //   campaignID: campaignID,
        //   topic: topic
        // }, function (error, result) {
        //   if (!error) {
        //     console.log(result)
        //   }
        // });
        // event.watch(function (error, result) {
        //   if (!error)
        //     console.log(result);
        // });
        // event.stopWatching();
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
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: process.env.VUE_APP_CHAINID,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.pushMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      console.log(res);
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.LogRegister({
            who: self.fromAddress
          }, function (error, result) {
            if (!error) {
              console.log(result);
              resolve(true);
            } else {
              reject(false)
            }
          });
        });
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
      data = self.instance.checkin.getData(campaignID, self.fromAddress);
    } else {
      data = self.instance.methods.checkin(campaignID, self.fromAddress).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: process.env.VUE_APP_CHAINID,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.pushMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      console.log(res);
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.LogCheckedIn({
            who: self.fromAddress
          }, function (error, result) {
            if (!error) {
              console.log(result);
              resolve(true);
            } else {
              reject(false)
            }
          });
        });
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
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: process.env.VUE_APP_CHAINID,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.pushMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      console.log(res);
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.LogQuestion({
            questioner: questioner,
            replier: replier
          }, function (error, result) {
            if (!error) {
              console.log(result);
              resolve(true);
            } else {
              reject(false)
            }
          });
        });
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
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: process.env.VUE_APP_CHAINID,
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
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: process.env.VUE_APP_CHAINID,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let res = await tp.pushMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      console.log(res);
      if (res.result) {
        return new Promise((resolve, reject) => {
          self.instance.LogClose({
            campaignID: campaignID
          }, function (error, result) {
            if (!error) {
              console.log(result);
              resolve(true);
            } else {
              reject(false)
            }
          });
        });
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
        console.lg(transaction.status);
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
      res = self.instance.campaigns(campaignID);
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