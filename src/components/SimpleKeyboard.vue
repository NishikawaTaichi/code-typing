<template>
  <div :class="keyboardClass"></div>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

export default {
  name: "SimpleKeyboard",
  props: {
    keyboardClass: {
      default: "simple-keyboard",
      type: String,
    },
    input: {
      type: String,
    },
  },
  data: () => ({
    keyboard: null,
    layout: {
      default: [
        " 1 2 3 4 5 6 7 8 9 0 - ^ ￥ back",
        "{tab} q w e r t y u i o p @ [  ",
        "{lock} a s d f g h j k l ; : ] {enter}",
        "{shift} z x c v b n m , . /  \\ {shift}",
        ".com @ {space}",
      ],
      shift: [
        " ! '' # $ % &amp; ' ( )  = ~ | back",
        "{tab} Q W E R T Y U I O P ` {  ",
        "{lock} A S D F G H J K L + * } {enter}",
        "{shift} Z X C V B N M &lt; &gt; ? _ {shift}",
        "fn ctrl win alt {space}  alt PrtSc Ctrl",
      ],
    },
    tabCharOnTab: true,
  }),
  mounted() {
    this.keyboard = new Keyboard(this.keyboardClass, {
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      physicalKeyboardHighlight: true,
      layout: this.layout,
      layoutName: "default",
    });
  },
  methods: {
    onChange(input) {
      this.$emit("onChange", input);
    },
    onKeyPress(button) {
      this.$emit("onKeyPress", button);

      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === "{shift}" || button === "{lock}") this.handleShift();
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";

      this.keyboard.setOptions({
        layoutName: shiftToggle,
      });
    },
  },
  watch: {
    input(input) {
      this.keyboard.setInput(input);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
