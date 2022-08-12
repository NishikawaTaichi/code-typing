<template>
  <div id="main" class="fill-height">
    <div v-if="playing" :key="1">
      <v-sheet
        elevation="2"
        class="rounded-lg spacing-playground pa-10 font-weight-medium mx-auto"
        min-height="40vh"
        max-width="1000px"
      >
        <p class="text-h4">
          <span>{{ typingStr }}</span>
          {{ questionStr }}
        </p>
      </v-sheet>
      <br />
      <br />
      <p class="text-h5">{{ correctedWordCount }} / {{ wordCounts }}</p>
      <p class="text-h4">miss: {{ missCount }}</p>
    </div>
    <div v-else>
      <p class="text-h4">spaceでスタート</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      questions: [
        `function(){created boolean}`,
        "function(){created boolean}",
        "function(){created boolean}",
      ],
      questionStr: "",
      typingStr: "",
      missCount: 0,
      playing: false,
      correctedWordCount: 0,
      wordCounts: 0,
      correctAudio: new Audio(require("@/assets/Correct_Answer.mp3")),
    };
  },
  created() {
    addEventListener("keydown", (e) => {
      if (e.key !== " " || this.playing) {
        return;
      }
      this.playing = true;
      this.setWord();
      this.keyDown();
      console.log("created");
    });
  },
  mounted() {
    this.wordCounts = this.questions.length;
  },
  methods: {
    setWord() {
      this.questionStr = this.questions.splice(
        Math.floor(Math.random() * this.questions.length),
        1
      )[0];
    },
    keyDown() {
      addEventListener("keydown", (e) => {
        // if (this.words.length === 0) {
        //   this.playing = false;
        //   return;
        // }
        if (e.key !== this.word[0]) {
          this.missCount++;
          return;
        }
        this.typingString += e.key;
        this.questionStr = this.questionStr.slice(1);
        if (this.questionStr.length === 0) {
          this.correctAudio.play();
          this.typingString = "";
          this.correctedWordCount++;
          this.setWord();
        }
      });
    },
  },
};
</script>

<style scoped>
#main {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
span {
  opacity: 0.5;
}
</style>
