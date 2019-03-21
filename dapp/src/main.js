import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import Web3 from 'web3'

Vue.config.productionTip = false

// window.addEventListener("load", async () => {
//   if (window.web3) {
//     console.log('mateMask')
//     window.web3 = new Web3(web3.currentProvider)
//   } else {
//     console.log('ganache cli provider')
//     window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')