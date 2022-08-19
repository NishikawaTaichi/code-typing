<template>
  <v-container class="score-box">
    <v-row>
      <v-col cols="2">
        <v-sheet rounded="lg">
          <v-list color="transparent">
            <v-list-item
              v-for="(value, key) in tabs"
              :key="key"
              link
              @click="onclick(key)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ value }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <!-- <v-divider class="my-2"></v-divider> -->

            <!-- <v-list-item link color="grey lighten-4">
              <v-list-item-content>
                <v-list-item-title>総合</v-list-item-title>
              </v-list-item-content>
            </v-list-item> -->
          </v-list>
        </v-sheet>
      </v-col>

      <v-col>
        <v-sheet min-height="70vh" rounded="lg" class="score-sheet">
          <keep-alive>
            <component
              :is="currentTab"
              :scoreList="scoreList"
              ref="childComponents"
            ></component>
          </keep-alive>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AccurateScore from "@/components/score/AccurateScore.vue";
import WpmScore from "@/components/score/WpmScore.vue";
import TimeScore from "@/components/score/TimeScore.vue";
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
    AccurateScore,
    WpmScore,
    TimeScore,
  },
  data() {
    return {
      auth: null,
      scoreList: [],
      current: "Accurate",
      tabs: {
        Accurate: "精度",
        Wpm: "WPM",
        Time: "タイム",
      },
    };
  },
  computed: {
    currentTab() {
      return this.current + "Score";
    },
    tabNames() {
      return Object.keys(this.tabs);
    },
  },
  methods: {
    onclick(tab) {
      this.current = tab;
    },
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

    this.$refs.childComponents.setArray();
    // // vuexに格納
    // this.$store.dispatch("setAsyncScores", this.scoreList);
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
