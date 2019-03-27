// import Contract from 'truffle-contract'
// import salonTokenContract from "../../../contract/build/contracts/SalonToken.json";
import tp from "tp-js-sdk";

const SalonToken = {
  // contract: null,

  instance: null,

  fromAddress: null,

  init: async function () {
    let self = this;

    // self.contract = Contract(SalonTokenContract)
    // self.contract.setProvider(window.web3.currentProvider)
    // let fromAccount = web3.currentProvider.selectedAddress
    // self.contract.defaults({
    //   from: "0xa0eaf3ddbcf690f5f08f374b6fe01c71ff8dc54c"
    // })
    // self.instance = await self.contract.at("0x4752EdD89a908306c7a8112e35F1a6C10cf79C63")
    // self.instance = await self.contract.deployed()

    const res = await tp.getCurrentWallet();
    self.fromAddress = res.data.address;
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      self.instance = chain3.mc.contract(JSON.parse(process.env.VUE_APP_TOKENABI)).at(process.env.VUE_APP_TOKEN_ADDRESS_MOAC);
    } else {
      self.instance = new web3.eth.Contract(JSON.parse(process.env.VUE_APP_TOKENABI), process.env.VUE_APP_TOKEN_ADDRESS);
    }
  },

  totalSupply: async function () {
    let self = this;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let tokens = await self.instance.totalSupply.call().catch(e => {
        console.log(e);
      });
      return chain3.fromSha(tokens, 'mc');
    }
    let tokens = await self.instance.methods.totalSupply().call().catch(e => {
      console.log(e);
    });
    return web3.utils.fromWei(tokens);
  },

  getBalance: async function () {
    let self = this;
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      let tokens = await self.instance.balanceOf.call(self.fromAddress).catch(e => {
        console.log(e);
      });
      return chain3.fromSha(tokens, 'mc');
    }
    let tokens = await self.instance.methods.balanceOf(self.fromAddress).call().catch(e => {
      console.log(e);
    });
    return web3.utils.fromWei(tokens);
  },

  transfer: async function (toAddress, amount) {
    let self = this;
    let data;
    let _amount;

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      _amount = chain3.toSha(amount, 'mc');
      data = self.instance.transfer.getData(toAddress, _amount);
    } else {
      _amount = web3.utils.toWei(amount);
      data = self.instance.methods.transfer(toAddress, _amount).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: process.env.VUE_APP_TOKEN_ADDRESS,
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


    // const transfer_logs = await self.instance.transfer(
    //   toAddress,
    //   web3.utils.toWei(amount)
    // );
    // const transferEvent = transfer_logs.logs.find(e => e.event === "Transfer");
    // if (transferEvent) {
    //   return true;
    // }
    // return false;
  },

  isAddress: function (address) {
    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      return chain3.isAddress(address);
    }
    return web3.utils.isAddress(address);
  }
};

export default SalonToken;