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
        >リセット</v-btn
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
      <p class="text-h4">スタート</p>
      <v-btn depressed color="primary" class="mb-6" @click="startTyping"
        >New Game</v-btn
      >
    </div>
    <!-- --------------------------------------------------------------------------------------- -->
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
import { getFirestore, setDoc, doc } from "firebase/firestore";
import SimpleKeyboard from "../components/SimpleKeyboard.vue";
import OpenModal from "@/components/OpenModal.vue";

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
      auth: {},
    };
  },
  computed: {
    // typedStr() {
    //   return this.questionStr.slice(0, this.currentIndex);
    // },
    typingStr() {
      console.log(this.questionStr[this.currentIndex]);
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
  },
  created() {
    this.auth = JSON.parse(sessionStorage.getItem("user"));
    console.log("uid:", this.auth.uid);
  },
  mounted() {
    // console.log(this.$refs.div);
    this.$refs.startGame.focus();
    this.wordCounts = this.questions.length;
    // addEventListener("keydown", (e) => {
    //   if (e.key !== " " || this.playing) {
    //     return;
    //   }
    //   this.playing = true;
    //   this.setWord();
    //   // this.keyDown();
    //   console.log("created");
    // });
  },
  watch: {
    playing: function (newVal) {
      // await (this.playing = true);
      if (newVal === true) {
        // console.log("表示/非表示");
        this.$nextTick(() => {
          // console.log(this.$refs.typingArea.$el);
          this.$refs.typingArea.$el.focus();
        });
      }
    },
    questionStr: function () {
      console.log(this.questionStr);
    },
  },
  methods: {
    onBlur() {
      // alert("focusが外れました");
      this.$refs.typingArea.$el.focus();
    },
    onBlurStartGame() {
      // alert("focusが外れました");
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
      // console.log(e);
      if (e === undefined) return;
      if (this.questionStr[this.currentIndex] === "↵" && e.key === "Enter") {
        console.log(true);
        this.typedStr += "\n";
        this.isMissType = false;
        this.currentIndex++;
      } else if (e.key === this.questionStr[this.currentIndex]) {
        // if (e.key === "Enter") {
        //   console.log("改行");
        // }
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
      // const userDocRef = doc(db, "users", this.auth.uid);
      const scoreRef = doc(db, "users", this.auth.uid, "scores");
      await setDoc(
        scoreRef,
        {
          id: this.auth.uid,
          time: this.formatedTime,
          accuracy: this.accurateTyping,
          wpm: this.wpm,
        },
        { merge: true }
      ).catch((error) => {
        console.log(error);
      });
      // const userDocRef = doc(db, "users", this.user.uid);
      // const userDocSnap = await getDoc(userDocRef);

      // if (userDocSnap.exists()) {
      //   await updateDoc(userDocRef, {
      //     id: this.user.uid,
      //     time: this.formatedTime,
      //     accuracy: this.accurateTyping,
      //     wpm: this.wpm,
      //   });
      // }
      // const docRef = addDoc(collection(db, "scores"), {
      //   id: this.user.uid,
      //   time: this.formatedTime,
      //   accuracy: this.accurateTyping,
      //   wpm: this.wpm,
      // });
    },
    // keyDown() {
    //   addEventListener("keydown", (e) => {
    //     // 終了していたら開始しない
    //     if (this.finished) return;
    //     if (!this.started) {
    //       this.started = true;
    //       const startTime = new Date().getTime();
    //       this.timer = setInterval(() => {
    //         this.timeOfTyping = new Date().getTime() - startTime;
    //       }, 100);
    //     }
    //     //入力文字とお題の文字が一致したら
    //     if (e.key === this.questionStr[this.currentIndex]) {
    //       //入力文字を格納し、お題から一文字削除
    //       this.isMissType = false;
    //       this.currentIndex++;
    //       //お題の文字の範囲外になったら
    //       if (this.currentIndex + 1 > this.questionStr.length) {
    //         clearInterval(this.timer);
    //         this.finished = true;
    //         this.dialog = true;
    //         // this.setWord();
    //       }
    //     } else {
    //       // 入力文字とお題が一致しない場合は、
    //       this.isMissType = true;
    //       this.missCount++;
    //     }
    //   });
    // },
    refleshAll() {
      this.playing = false;
      this.questions = ['function() {↵  console.log("aaaaaaaaaaa");↵}'];
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
