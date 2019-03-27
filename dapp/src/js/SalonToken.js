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
    // const abi = [{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":true,"inputs":[],"name":"tokenStorage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xb199efb5"},{"constant":false,"inputs":[{"name":"newAdministrator","type":"address"}],"name":"transferAdministrator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc648a3a2"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf2fde38b"},{"constant":true,"inputs":[],"name":"administrator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf53d0a8e"},{"constant":true,"inputs":[],"name":"tokenImpl","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xffc4992f"},{"inputs":[{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"newAddress","type":"address"},{"indexed":true,"name":"oldAddress","type":"address"}],"name":"Upgrade","type":"event","signature":"0xd23ce5645530506727523fe6d7939e72bb49102454460bc72f0f5baec60ac718"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event","signature":"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x06fdde03"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x95d89b41"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x313ce567"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x18160ddd"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xdd62ed3e"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x095ea7b3"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x23b872dd"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x39509351"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa457c2d7"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"value","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x40c10f19"},{"constant":false,"inputs":[{"name":"account","type":"address"},{"name":"value","type":"uint256"}],"name":"burn","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9dc29fac"},{"constant":false,"inputs":[{"name":"newImpl","type":"address"}],"name":"upgrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x0900f010"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferByAdministrator","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9fea2d53"}]

    if (process.env.VUE_APP_NETWORK === 'MOAC') {
      // const contract = chain3.mc.contract(abi);
      self.instance = chain3.mc.contract(JSON.parse(process.env.VUE_APP_TOKENABI)).at('');
    } else {
      self.instance = new web3.eth.Contract(JSON.parse(process.env.VUE_APP_TOKENABI), process.env.VUE_APP_TOKEN_ADDRESS);
    }
    // self.instance = new web3.eth.Contract(abi, process.env.VUE_APP_TOKEN_ADDRESS, {
    //   from: res.data.address,
    //   gasPrice: "20000000000",
    //   gas: 8000000
    // });
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