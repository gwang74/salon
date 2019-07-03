// import Contract from 'truffle-contract'
// import salonTokenContract from "../../../contract/build/contracts/SalonToken.json";
import tp from "tp-js-sdk";

const SalonToken = {
  // contract: null,

  instance: null,

  fromAddress: null,

  toAddress: null,

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
    if (process.env.VUE_APP_NETWORK === "MOAC") {
      self.toAddress = process.env.VUE_APP_TOKEN_ADDRESS_MOAC;
      self.instance = chain3.mc
        .contract(JSON.parse(process.env.VUE_APP_TOKENABI))
        .at(self.toAddress);
    } else {
      self.toAddress = process.env.VUE_APP_TOKEN_ADDRESS;
      self.instance = new web3.eth.Contract(
        JSON.parse(process.env.VUE_APP_TOKENABI),
        self.toAddress
      );
    }
  },

  totalSupply: async function () {
    let self = this;

    if (process.env.VUE_APP_NETWORK === "MOAC") {
      let tokens = self.instance.totalSupply();
      return chain3.fromSha(tokens, "mc");
    }
    let tokens = await self.instance.methods
      .totalSupply()
      .call()
      .catch(e => {
        console.log(e);
      });
    return web3.utils.fromWei(tokens);
  },

  getTokenBalance: async function () {
    let self = this;
    if (process.env.VUE_APP_NETWORK === "MOAC") {
      let tokens = self.instance.balanceOf(self.fromAddress);
      return chain3.fromSha(tokens, "mc");
    }
    let tokens = await self.instance.methods
      .balanceOf(self.fromAddress)
      .call()
      .catch(e => {
        console.log(e);
      });
    return web3.utils.fromWei(tokens);
  },

  transfer: async function (toAddress, amount) {
    let self = this;
    let data;
    let _amount;

    if (process.env.VUE_APP_NETWORK === "MOAC") {
      _amount = chain3.toSha(amount, "mc");
      data = self.instance.transfer.getData(toAddress, _amount);
    } else {
      _amount = web3.utils.toWei(amount);
      data = self.instance.methods.transfer(toAddress, _amount).encodeABI();
    }

    let transaction = {
      from: self.fromAddress,
      to: self.toAddress,
      gasPrice: process.env.VUE_APP_GASPRICE,
      gasLimit: process.env.VUE_APP_GAS,
      chainId: chain3.version.network,
      data: data
    };

    if (process.env.VUE_APP_NETWORK === "MOAC") {
      let res = await tp.sendMoacTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        return self.waitTransfer(res.data);
      }
    } else {
      let res = await tp.signEthTransaction(transaction).catch(e => {
        console.log(e);
      });
      if (res.result) {
        let transaction = await web3.eth
          .sendSignedTransaction(res.data)
          .catch(e => {
            console.log(e);
          });
        //transaction success
        if (web3.utils.hexToNumber(transaction.status) == 1) {
          return true;
        }
      }
    }
  },

  getBalance: async function () {
    let self = this;
    if (process.env.VUE_APP_NETWORK === "MOAC") {
      let balance = chain3.mc.getBalance(self.fromAddress).toString();
      return chain3.fromSha(balance, "mc");
    } else {
      let balance = await web3.eth.getBalance(self.fromAddress).toString();
      return web3.utils.fromWei(balance);
    }
  },

  isAddress: function (address) {
    if (process.env.VUE_APP_NETWORK === "MOAC") {
      return chain3.isAddress(address);
    }
    return web3.utils.isAddress(address);
  },

  waitTransfer: function (transactionHash) {
    return new Promise((resolve, reject) => {
      while (true) {
        let receipt = chain3.mc.getTransactionReceipt(transactionHash);
        if (receipt && chain3.fromDecimal(receipt.status) == 1) {
          resolve(true);
          break;
        } else if (receipt && chain3.fromDecimal(receipt.status) == 0) {
          reject(false);
          break;
        }
      }
    });
  }
};

export default SalonToken;