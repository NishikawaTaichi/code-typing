<template>
  <v-container class="score-box">
    <v-row>
      <v-col cols="2">
        <v-sheet rounded="lg">
          <v-list color="transparent">
            <v-list-item
              v-for="scoreType in scoreTypeList"
              :key="scoreType"
              link
            >
              <v-list-item-content>
                <v-list-item-title>{{ scoreType }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider class="my-2"></v-divider>

            <v-list-item link color="grey lighten-4">
              <v-list-item-content>
                <v-list-item-title>総合</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-col>

      <v-col>
        {{ scoreList ? scoreList : "" }}
        <v-sheet min-height="70vh" rounded="lg" class="score-sheet">
          <LineChart />
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from "@/components/ScoreLine.vue";
// import db from "@/main";
import {
  getFirestore,
  doc,
  getDocs,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
export default {
  components: {
    LineChart,
  },
  data() {
    return {
      auth: null,
      scoreTypeList: ["タイム", "精度", "WPM"],
      scoreList: [],
    };
  },
  created() {
    this.auth = JSON.parse(sessionStorage.getItem("user"));
  },
  async mounted() {
    const db = getFirestore();
    const userDocRef = doc(db, "users", this.auth.uid);
    const userScoreDocRef = collection(userDocRef, "scores");
    const q = query(userScoreDocRef, orderBy("createdAt", "asc"));
    const docSnap = await getDocs(q);
    docSnap.forEach((doc) => {
      this.scoreList.push(doc.data());
    });
  },
};
</script>

<style scoped>
.score-box {
  margin-top: 50px;
}
.score-sheet {
  padding: 40px;
}
</style>
