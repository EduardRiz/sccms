import Vue from 'vue'
import App from './App.vue'
import api from "@/api.js";
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VueCryptojs from 'vue-cryptojs'
import filters from './filters.js';
import RecordStatus from "@/components/RecordStatus.vue";
import RecordAudit from "@/components/RecordAudit.vue";
import TagsEditor from "@/components/TagsEditor.vue";
import RecordInfoField from "@/components/RecordInfoField.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

Vue.use(VueCryptojs);
Vue.component("sc-record-status", RecordStatus);
Vue.component("sc-record-audit", RecordAudit);
Vue.component("sc-confirm-dialog", ConfirmDialog);
Vue.component("sc-record-info", RecordInfoField);
Vue.component("TagsEditor", TagsEditor);
Vue.config.productionTip = false
Vue.prototype.$api = api;
// for moment's filters
Vue.use(require('vue-moment'));
filters.forEach(f => {
  Vue.filter(f.name, f.func)
})

const vm = new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
api.setVm(vm);