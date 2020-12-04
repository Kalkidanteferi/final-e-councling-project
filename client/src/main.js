import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/lib/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { ValidationProvider } from 'vee-validate/dist/vee-validate.full.esm';
import { ValidationObserver } from 'vee-validate';
import VueTimeago from 'vue-timeago'
import lineClamp from 'vue-line-clamp'
// import { VueEditor } from "vue2-editor";
import wysiwyg from "vue-wysiwyg";
// import VueSocketio from 'vue-socket.io'
// Vue.use(VueSocketio, 'http://localhost:3000')

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

Vue.config.productionTip = false
Vue.use(VueToast);
// Vue.use(VueEditor);
Vue.use(wysiwyg, {
 
});

Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'en', // Default locale
  // We use `date-fns` under the hood
  // So you can use all locales from it
  locales: {
    'zh-CN': require('date-fns/locale/zh_cn'),
    ja: require('date-fns/locale/ja')
  }
})

Vue.use(lineClamp, {})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
