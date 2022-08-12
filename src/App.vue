<template>
  <v-app>
    <HeaderComp></HeaderComp>
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HeaderComp from "./components/HeaderComp.vue";

export default {
  name: "App",
  components: { HeaderComp },
};
</script>
