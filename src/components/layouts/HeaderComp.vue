<template>
  <div>
    <v-navigation-drawer v-model="drawer" absolute temporary app>
      <v-list-item>
        <v-list-item-avatar>
          <v-img src="https://joeschmoe.io/api/v1/random"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ auth && auth.displayName }}
          </v-list-item-title>
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
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="deep-purple accent-4" dense dark app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Code Typing</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
export default {
  data: () => ({
    drawer: null,
    items: [
      { title: "Home", icon: "mdi-view-dashboard", path: "/" },
      { title: "Score", icon: "mdi-chart-line", path: "/score" },
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
          sessionStorage.removeItem("user");
          sessionStorage.message = "ログアウトに成功しました";
          this.$router.push("/login");
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
  mounted() {
    this.auth = JSON.parse(sessionStorage.getItem("user"));
  },
};
</script>

<style scoped>
.routerLink {
  text-decoration: none;
  color: black;
}
</style>
