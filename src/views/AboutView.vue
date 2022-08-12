<template>
  <div class="container">
    <div class="title">Typing Game</div>
    <div class="marker"></div>
    <v-btn
      v-if="playing != true"
      depressed
      color="primary"
      class="mb-6"
      @click="startGame"
      >startGame</v-btn
    >
    <div v-if="playing">
      <div class="question">{{ current_question }}</div>
      <div v-if="currentQuestionCounts === questionCounts" class="clear">
        clear
      </div>
      <v-text-field
        :hide-details="true"
        class="typeForm mb-6"
        v-model="typeBox"
      ></v-text-field>
      <div class="gauge-wrapper"></div>
      <div :style="styleObject" class="gauge"></div>
      <div>{{ currentQuestionCounts }}/{{ questionCounts }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutView",
  data() {
    return {
      playing: false,
      word: "apple",
      current_question: "",
      questions: ["apple", "banana", "a", "nishikawa", "taichi"],
      typeBox: "",
      currentQuestionCounts: 0,
      questionCounts: 0,
      audio: new Audio(require("@/assets/prj_beep.mp3")),
    };
  },
  methods: {
    startGame() {
      this.playing = true;
    },
  },
  computed: {
    remainQuestion() {
      return this.questions.length;
    },
    styleObject() {
      let width = 20 * this.currentQuestionCounts + "%";
      let color = "orange";
      if (this.currentQuestionCounts == 5) {
        color = "#03a9f4";
      }
      return {
        width: width,
        "background-color": color,
      };
    },
  },
  mounted() {
    this.current_question = this.questions[0];
    this.questionCounts = this.questions.length;
  },
  watch: {
    typeBox(e) {
      // if (e[0] !== this.word[0]) {
      //   this.audio.currentTime = 0;
      //   this.audio.play();
      //   console.log("ミス");
      //   return;
      // }
      if (e === this.current_question) {
        this.questions.splice(0, 1);
        this.current_question = this.questions[0];
        this.typeBox = "";
        this.currentQuestionCounts++;
      } else {
        // this.audio.currentTime = 0;
        // this.audio.play();
      }
    },
  },
};
</script>

<style>
.container {
  width: 400px;
  margin: 0 auto;
  text-align: center;
}
.title {
  position: relative;
  font-size: 48px;
}

.marker {
  width: 100%;
  height: 35%;
  background-color: #a2a2a270;
  position: absolute;
  bottom: 5%;
  z-index: -1;
}
.question {
  color: gray;
}
.clear {
  color: blue;
}
.typeForm input {
  text-align: center;
}
.gauge {
  height: 12px;
}
.gauge-wrapper {
  border: 1px solid;
  height: 12px;
}
</style>
