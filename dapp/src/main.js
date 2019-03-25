import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import Web3 from 'web3'

Vue.config.productionTip = false

// window.web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     "http://localhost:8545"
//   )
// );

window.web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/2413e0137d6b4a3181d29c8f7727fcf6"
  )
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')