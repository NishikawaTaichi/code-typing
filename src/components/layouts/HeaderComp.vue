<template>
  <div>
    <v-navigation-drawer v-model="drawer" absolute temporary app>
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://joeschmoe.io/api/v1/random"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user && user.displayName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="logout" v-if="isLoggedIn">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="blue darken-3" dense dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Code Typing</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
  </div>
</template>

<script>
import { signOut, getAuth } from "firebase/auth";
import firebaseUtils from "./../../firebase/firebase-utils";

export default {
  data: () => ({
    drawer: null,
    loginItems: [
      { title: "Home", icon: "mdi-view-dashboard", path: "/" },
      { title: "Score", icon: "mdi-chart-line", path: "/score" },
    ],
    notLoggedInItems: [
      { title: "Signup", icon: "mdi-account-check", path: "/signup" },
      { title: "Login", icon: "mdi-login", path: "/login" },
    ],
    auth: {},
  }),
  methods: {
    logout() {
      console.log("logout");
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // vuexのログイン中のユーザー情報を更新
          firebaseUtils.onAuth();
          sessionStorage.message = "ログアウトに成功しました";
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    items() {
      if (this.isLoggedIn) {
        return this.loginItems;
      } else {
        return this.notLoggedInItems;
      }
    },
  },
};
</script>

<style scoped>
.routerLink {
  text-decoration: none;
  color: black;
}
</style>
