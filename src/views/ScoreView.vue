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
  },
  data() {
    return {
      auth: null,
      scoreList: [],
      current: "Accurate",
      tabs: {
        Accurate: "精度",
        Wpm: "WPM",
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
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    onclick(tab) {
      this.current = tab;
    },
  },
  async mounted() {
    const db = getFirestore();
    const userDocRef = doc(db, "users", this.user.uid);
    const userScoreDocRef = collection(userDocRef, "scores");
    const q = query(userScoreDocRef, orderBy("createdAt", "asc"));
    const docSnap = await getDocs(q);

    docSnap.forEach((doc) => {
      this.scoreList.push(doc.data());
    });

    this.$refs.childComponents.setArray();
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
