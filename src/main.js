import Vue from 'vue'
import App from './App.vue'
import api from "@/api.js";
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VueCryptojs from 'vue-cryptojs'

Vue.use(VueCryptojs);
Vue.config.productionTip = false
Vue.prototype.$api = api;
// for moment's filters
Vue.use(require('vue-moment'));

const vm = new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
api.setVm(vm);
