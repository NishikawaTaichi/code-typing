import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import dayjs from "./plugins/days";
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  dayjs,
  render: (h) => h(App),
}).$mount("#app");
