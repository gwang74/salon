import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import zhHans from 'vuetify/es5/locale/zh-Hans'

Vue.use(Vuetify, {
  iconfont: 'mdi',
  lang: {
    locales: {
      zhHans
    },
    current: 'zh-Hans'
  },
  theme: {
    primary: '#3f51b5',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})