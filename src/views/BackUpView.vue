<template>
  <div id="main" class="fill-height">
    <div v-if="playing" :key="1">
      <v-sheet
        elevation="2"
        class="rounded-lg spacing-playground pa-10 font-weight-medium mx-auto"
        min-height="40vh"
        max-width="1000px"
      >
        <p class="text-h3">
          <span class="green--text text--darken-3">{{ typedStr }}</span>
          <span v-if="isMissType" class="red--text grey lighten-2">{{
            typingStr
          }}</span>
          <span v-else class="black--text grey lighten-2">{{ typingStr }}</span>
          <span class="grey--text">{{ notYetTypedStr }}</span>
        </p>
      </v-sheet>
      <br />
      <br />
      <!-- <p class="text-h5">{{ correctedWordCount }} / {{ wordCounts }}</p> -->
      <p class="text-h7">
        ミスタイプ: {{ missCount }} 回 タイム:
        {{ formatedTime }}
      </p>
      <span v-if="currentIndex === 0">CPM: -</span>
      <span v-else>CPM: {{ cpm }}</span>
      <br />
      <v-btn depressed color="primary" class="mb-6" @click="refleshAll"
        >リセット</v-btn
      >
    </div>
    <div v-else>
      <p class="text-h4">spaceでスタート</p>
    </div>
    <!-- --------------------------------------------------------------------------------------- -->
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5 blue--text">Clear!</v-card-title>

        <v-card-text>
          タイム: {{ timeOfTyping }}<br />
          精度: {{ timeOfTyping }}<br />
          CPM(1分あたりの入力文字数): {{ cpm }}<br />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn dark color="green darken-1" @click="refleshAll"
            >もう一度挑戦する</v-btn
          >

          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      playing: false,
      questions: [`aaaaaaaaa`],
      questionStr: "", //お題
      currentIndex: 0, //文字列の中で今どこを入力中か。typingStr以上のとき終了してモーダル表示
      missCount: 0, //ミスタイプした数
      isMissType: false, //文字が一文字でもタイポしたら赤く表示
      finished: false, // typingの終了フラグ
      started: false, //typingが始まったフラグ
      timeOfTyping: 0, //かかってる時間
      correctedWordCount: 0,
      wordCounts: 0,
      correctAudio: new Audio(require("@/assets/Correct_Answer.mp3")),
      timer: 0,
      dialog: false,
    };
  },
  computed: {
    typedStr() {
      return this.questionStr.slice(0, this.currentIndex);
    },
    typingStr() {
      return this.questionStr[this.currentIndex];
    },
    notYetTypedStr() {
      return this.questionStr.slice(
        this.currentIndex + 1,
        this.questionStr.length
      );
    },
    cpm() {
      return ((this.currentIndex / this.timeOfTyping) * 1000 * 60).toFixed(0);
    },
    formatedTime() {
      let ss = Math.floor(this.timeOfTyping / 1000) % 60;
      let mm = Math.floor(this.timeOfTyping / 1000 / 60) % 60;
      if (mm < 10) mm = "0" + mm;
      if (ss < 10) ss = "0" + ss;
      return mm + ":" + ss;
    },
  },
  created() {},
  mounted() {
    this.wordCounts = this.questions.length;
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
  methods: {
    setWord() {
      this.questionStr = this.questions.splice(
        Math.floor(Math.random() * this.questions.length),
        1
      )[0];
    },
    keyDown() {
      addEventListener("keydown", (e) => {
        // 終了していたら開始しない
        if (this.finished) return;
        if (!this.started) {
          this.started = true;
          const startTime = new Date().getTime();
          this.timer = setInterval(() => {
            this.timeOfTyping = new Date().getTime() - startTime;
          }, 100);
        }
        //入力文字とお題の文字が一致したら
        if (e.key === this.questionStr[this.currentIndex]) {
          //入力文字を格納し、お題から一文字削除
          this.isMissType = false;
          this.currentIndex++;
          //お題の文字の範囲外になったら
          if (this.currentIndex + 1 > this.questionStr.length) {
            clearInterval(this.timer);
            this.finished = true;
            this.dialog = true;
            // this.setWord();
          }
        } else {
          // 入力文字とお題が一致しない場合は、
          this.isMissType = true;
          this.missCount++;
        }
      });
    },
    refleshAll() {
      this.playing = false;
      this.questions = [
        `function(){created boolean}`,
        "function(){created boolean}",
        "function(){created boolean}",
      ];
      this.questionStr = "";
      this.currentIndex = 0; //文字列の中で今どこを入力中か。typingStr以上のとき終了してモーダル表示
      this.missCount = 0; //ミスタイプした数
      this.isMissType = false; //文字が一文字でもタイポしたら赤く表示
      this.finished = false; // typingの終了フラグ
      this.started = false; //typingが始まったフラグ
      this.timeOfTyping = 0; //かかってる時間
      this.correctedWordCount = 0;
      this.wordCounts = 0;
      this.dialog = false;
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
.stats {
  display: "inline";
  font-size: "20px";
  margin: "0 30px";
}
.rights {
  font-size: "20px";
  padding: "20px";
}
</style>
