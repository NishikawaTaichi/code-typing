<template>
  <v-app>
    <HeaderComp></HeaderComp>
    <v-main class="grey lighten-3">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HeaderComp from "./components/layouts/HeaderComp.vue";

export default {
  name: "App",
  components: { HeaderComp },
};
</script>
