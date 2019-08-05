import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import Web3 from 'web3'
import Chain3 from 'chain3'
import VConsole from 'vconsole'
import VueClipboard from 'vue-clipboard2'

// let vConsole = new VConsole();
Vue.use(VueClipboard)

Vue.config.productionTip = false

if (process.env.VUE_APP_NETWORK === 'MOAC') {
  let hosts = process.env.VUE_APP_SALON_VNODE_MOAC.split(',');
  while (true) {
    let index = Math.floor(Math.random() * hosts.length);
    window.chain3 = new Chain3(new Chain3.providers.HttpProvider("https://" + hosts[index]));
    console.log(chain3.isConnected())
    if (chain3.isConnected()) {
      break;
    }
  }

} else {
  window.web3 = new Web3(new Web3.providers.HttpProvider(process.env.VUE_APP_SALON_VNODE));
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')