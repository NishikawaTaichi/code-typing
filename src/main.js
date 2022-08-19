import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import dayjs from "./plugins/days";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase/firebase-config";

Vue.config.productionTip = false;

const firebaseApp = initializeApp(firebaseConfig);
export { firebaseApp };

new Vue({
  router,
  store,
  vuetify,
  dayjs,
  render: (h) => h(App),
}).$mount("#app");
