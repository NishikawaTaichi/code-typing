import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import dayjs from "./plugins/days";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase/firebase-config";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

Vue.config.productionTip = false;

const firebaseApp = initializeApp(firebaseConfig);
// // 認証状態の永続性の変更 → 現在のセッションまたはタブでのみ状態が保持
setPersistence(getAuth(), browserSessionPersistence);
export { firebaseApp };

new Vue({
  router,
  store,
  vuetify,
  dayjs,
  render: (h) => h(App),
}).$mount("#app");
