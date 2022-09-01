import { getAuth, onAuthStateChanged } from "firebase/auth";
import store from "@/store/index";

export default {
  onAuth() {
    return new Promise((resolve) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (u) => {
        let user = u ? JSON.parse(JSON.stringify(u)) : {};
        let status = u ? true : false;
        store.dispatch("onAsyncAuthStateChanged", { user: user });
        store.dispatch("onAsyncUserStatusChanged", { status: status });
        resolve();
      });
    });
  },
};
