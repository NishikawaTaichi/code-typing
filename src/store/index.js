import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    scores: [],
    user: {}, //ログイン情報
    status: false, //ログイン状態
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.status;
    },
  },
  mutations: {
    setScores(state, payload) {
      this.state.scores.push(payload);
    },
    onAuthStateChanged(state, user) {
      state.user = user; //firebaseが返したユーザー情報を格納
    },
    onUserStatusChanged(state, status) {
      state.status = status; // ログインしているかどうか true or false
    }
  },
  actions: {
    setAsyncScores({ commit }, payload) {
      commit("setScores", payload);
    },
  },
  modules: {},
});
