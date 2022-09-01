<template>
  <div id="main">
    <div v-if="playing">
      <v-sheet
        elevation="2"
        class="rounded-lg spacing-playground pa-10 font-weight-medium mx-auto textcontent focus"
        min-height="40vh"
        max-width="800px"
        @keypress.prevent="onkeyPress"
        @blur="onBlur"
        key="playing"
        ref="typingArea"
        tabindex="0"
      >
        <div style="white-space: pre-wrap; text-align: start" class="text-h5">
          <p class="green--text text--darken-3 p-inline">{{ typedStr }}</p>
          <p v-if="isMissType" class="red--text grey lighten-2 p-inline">
            {{ typingStr }}
          </p>
          <p v-else class="black--text grey lighten-2 p-inline">
            {{ typingStr }}
          </p>
          <p class="grey--text p-inline">
            {{ notYetTypedStr.replaceAll("↵", "\n") }}
          </p>
        </div>
      </v-sheet>
      <br />
      <!-- <p class="text-h5">{{ correctedWordCount }} / {{ wordCounts }}</p> -->
      <p class="text-h7">
        ミスタイプ: {{ missCount }} 回 タイム:
        {{ formatedTime }}
        <span v-if="currentIndex === 0">WPM: -</span>
        <span v-else>WPM: {{ wpm }}</span>
      </p>
      <v-btn depressed color="primary" class="mb-6" @click="refleshAll"
        >お題を変更</v-btn
      >
      <SimpleKeyboard @onChange="onChange" :input="input" />
    </div>
    <div
      v-else
      @keypress.enter="startTyping"
      tabindex="0"
      ref="startGame"
      @blur="onBlurStartGame"
      class="focus"
    >
      <v-card style="max-width: 600px; margin: 0 auto" class="pa-3">
        <v-card-title class="text-h5">遊び方と注意事項</v-card-title>
        <v-divider class="my-2"></v-divider>
        <v-card-text class="text-subtitle-1 text-left">
          1.New Game もしくは Enterを押すとタイピングが開始します。
          <br />2.行末の↵は改行を表しています。Enterで改行してください。
          <br />3.Tabを用いたインデントは使用できません。spaceをご利用ください。
          <br />4.タイピングを終えると、スコアが表示されます。継続してスコアを高めていきましょう。
          <br />
        </v-card-text>
      </v-card>
      <br />
      <br />
      <p class="text-h4">スタート</p>
      <v-btn depressed color="primary" class="mb-6" @click="startTyping"
        >New Game</v-btn
      >
      <br />
      <br />
      <div class="text-h4" id="typing-animation"></div>
    </div>

    <OpenModal
      :formatedTime="formatedTime"
      :accurateTyping="Number(accurateTyping)"
      :wpm="Number(wpm)"
      :dialogProps="Boolean(dialog)"
      :refleshAll="refleshAll"
    ></OpenModal>
  </div>
</template>

<script>
// import db from "@/main";
import {
  getFirestore,
  addDoc,
  doc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import SimpleKeyboard from "../components/SimpleKeyboard.vue";
import OpenModal from "@/components/OpenModal.vue";
import { init } from "ityped";

export default {
  name: "HomeView",
  components: {
    SimpleKeyboard,
    OpenModal,
  },
  data() {
    return {
      playing: false,
      questions: [
        'function(num) {↵  if(num % 3 === 0 && num % 5 === 0) {↵    console.log("FizzBuzz");↵  } else if (num % 3 === 0) {↵    console.log("Fizz");↵  } else if (num % 5 === 0) {↵    console.log("Buzz");↵  } else {↵    console.log(num);↵  } ↵}',
      ],
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
      typedStr: "",
      input: "",
    };
  },
  computed: {
    // typedStr() {
    //   return this.questionStr.slice(0, this.currentIndex);
    // },
    typingStr() {
      // console.log(this.questionStr[this.currentIndex]);
      if (this.questionStr[this.currentIndex] !== undefined) {
        return this.questionStr[this.currentIndex].replaceAll("↵", "↵\n");
      } else {
        return this.questionStr[this.currentIndex];
      }
    },
    notYetTypedStr() {
      return this.questionStr
        .slice(this.currentIndex + 1, this.questionStr.length)
        .replaceAll("↵", "\n");
    },
    wpm() {
      return ((this.currentIndex / this.timeOfTyping) * 1000 * 60).toFixed(0);
    },
    formatedTime() {
      let time = this.$dayjs(this.timeOfTyping).format("mm:ss:SSS");
      return time;
    },
    accurateTyping() {
      return (
        (this.questionStr.length / (this.questionStr.length + this.missCount)) *
        100
      ).toFixed(1);
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
  mounted() {
    // console.log(this.$refs.div);
    this.$refs.startGame.focus();
    this.wordCounts = this.questions.length;
    this.initAnimation();
  },
  // updated() {
  //   this.initAnimation();
  // },
  watch: {
    playing: function (newVal) {
      if (newVal === true) {
        this.$nextTick(() => {
          this.$refs.typingArea.$el.focus();
        });
      }
      if (newVal === false) {
        this.$nextTick(() => {
          this.initAnimation();
        });
      }
    },
  },
  methods: {
    initAnimation() {
      let typingAnimation = document.querySelector("#typing-animation");
      init(typingAnimation, {
        showCursor: false,
        strings: [
          `ようこそ、${this.user.displayName}さん`,
          "タイピング練習頑張りましょう!",
        ],
      });
    },
    onBlur() {
      this.$refs.typingArea.$el.focus();
    },
    onBlurStartGame() {
      this.$refs.startGame.focus();
    },
    setWord() {
      this.questionStr = this.questions.splice(
        Math.floor(Math.random() * this.questions.length),
        1
      )[0];
    },
    onkeyPress(e) {
      // 終了していたら開始しない
      if (this.finished) return;
      if (!this.started) {
        this.started = true;
        const startTime = new Date().getTime();
        this.timer = setInterval(() => {
          this.timeOfTyping = new Date().getTime() - startTime;
        }, 100);
      }

      if (e === undefined) return;
      if (this.questionStr[this.currentIndex] === "↵" && e.key === "Enter") {
        // console.log(true);
        this.typedStr += "\n";
        this.isMissType = false;
        this.currentIndex++;
      } else if (e.key === this.questionStr[this.currentIndex]) {
        this.typedStr += e.key;
        this.isMissType = false;
        this.currentIndex++;
        //お題の文字の範囲外になったら
        if (this.currentIndex + 1 > this.questionStr.length) {
          clearInterval(this.timer);
          this.finished = true;
          this.dialog = true;
          this.setScore();
          // this.setWord();
        }
      } else {
        // 入力文字とお題が一致しない場合は、
        this.isMissType = true;
        this.missCount++;
      }
    },
    async setScore() {
      const db = getFirestore();
      const userDocRef = doc(db, "users", this.user.uid);
      const userScoreDocRef = collection(userDocRef, "scores");
      await addDoc(userScoreDocRef, {
        time: this.formatedTime,
        accuracy: this.accurateTyping,
        wpm: this.wpm,
        createdAt: serverTimestamp(),
      }).catch((error) => {
        console.log(error);
      });
    },
    refleshAll() {
      this.playing = false;
      this.questions = [
        'function greeting() {↵  console.log("Hello.");↵  console.log("Good morning.");↵}',
        'function payday() {↵  if(day === "22"){↵    console.log("today is payday");↵   }↵ }',
        'function(num) {↵  if(num % 3 === 0 && num % 5 === 0) {↵    console.log("FizzBuzz");↵  } else if (num % 3 === 0) {↵    console.log("Fizz");↵  } else if (num % 5 === 0) {↵    console.log("Buzz");↵  } else {↵    console.log(num);↵  } ↵}',
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
      this.typedStr = "";
      clearInterval(this.timer);
    },
    startTyping() {
      if (this.playing) {
        return;
      }
      this.playing = true;
      this.setWord();
      this.onkeyPress();
      // console.log("created");
    },
    onChange(input) {
      this.input = input;
    },
    onInputChange(input) {
      this.input = input.target.value;
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
.textcontent {
  white-space: pre-wrap;
}
.p-inline {
  display: inline;
}
.focus:focus {
  outline: none;
}
</style>
