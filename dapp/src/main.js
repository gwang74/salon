import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import Web3 from 'web3'
import Chain3 from 'chain3'
import VConsole from 'vconsole'
let vConsole = new VConsole();

Vue.config.productionTip = false

// window.web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "http://localhost:8545"
//   )
// );
if (process.env.VUE_APP_NETWORK === 'MOAC') {
  window.chain3 = new Chain3(new Chain3.providers.HttpProvider('http://192.168.1.8:8545'));
  console.log(chain3.isConnected());
} else {
  window.web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://ropsten.infura.io/v3/2413e0137d6b4a3181d29c8f7727fcf6"
    )
  );
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')