<template>
  <v-dialog v-model="dialog" max-width="290">
    <v-card>
      <v-card-title class="text-h5 blue--text">Clear!</v-card-title>

      <v-card-text>
        タイム: {{ formatedTime }}
        <br />
        精度: {{ accurateTyping }} %
        <br />
        wpm(1分あたりの入力文字数): {{ wpm }}
        <br />
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
</template>

<script>
export default {
  props: {
    formatedTime: {
      type: String,
      required: true,
    },
    accurateTyping: {
      type: Number,
      required: true,
    },
    wpm: {
      type: Number,
      required: true,
    },
    dialogProps: {
      type: Boolean,
      required: true,
    },
    refleshAll: {
      type: Function,
      required: true,
    },
  },
  computed: {
    dialog() {
      return this.dialogProps;
    },
  },
};
</script>
