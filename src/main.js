import Vue from 'vue'
import App from './App.vue'
import api from "@/api.js";
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VueCryptojs from 'vue-cryptojs'
import scclub from "./scclub.js"
import excel from 'vue-excel-export'

Vue.use(VueCryptojs);
Vue.use(scclub);
Vue.use(excel);

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

Vue.prototype.$rules = {
  required: (value) => !!value || vm.$t("error.required"),
  counter: (value) => value.length <= 20 || "Max 20 characters",
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !value || pattern.test(value) || vm.$t("error.email");
  },
};