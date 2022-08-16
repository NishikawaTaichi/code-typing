<template>
  <div class="signup-box">
    <v-card class="signup-form">
      <v-card-title class="signup-title">Sign Up</v-card-title>
      <v-card-subtitle>新規登録情報をご入力ください</v-card-subtitle>
      <v-btn to="/login" text color="light-blue">ログインはこちら</v-btn>
      <v-form v-model="valid" ref="form">
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="UserName"
          required
        ></v-text-field>

        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[passRules.required, passRules.min]"
          :type="showPass ? 'text' : 'password'"
          name="input-10-1"
          label="Password"
          hint="At least 8 characters"
          counter
          @click:append="showPass = !showPass"
        ></v-text-field>

        <v-card-actions>
          <v-btn
            class="mr-4"
            color="success"
            @click="submit"
            :disabled="isValid"
            >Sign Up</v-btn
          >
          <v-btn @click="clear">clear</v-btn>
        </v-card-actions>
        <v-alert
          dense
          outlined
          type="error"
          class="error-msg"
          v-if="errorMsg"
          >{{ errorMsg }}</v-alert
        >
      </v-form>
    </v-card>
  </div>
</template>

<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export default {
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "名前を入力してください",
      (v) => (v && v.length <= 10) || "名前は10文字以内で入力してください",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
    showPass: false,
    password: "",
    passRules: {
      required: (value) => !!value || "Password is Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
      emailMatch: () => `The email and password you entered don't match`,
    },
    errorMsg: "",
  }),
  computed: {
    isValid() {
      return !this.valid;
    },
  },
  methods: {
    clear() {
      this.$refs.form.reset();
    },
    submit() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(async (response) => {
          await updateProfile(response.user, { displayName: this.name });
          this.$refs.form.reset();
          sessionStorage.message = "新規作成に成功しました";
          this.$router.push("/login");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + "###" + errorMessage);
          this.errorMsg = "ユーザーの新規作成に失敗しました";
        });
    },
    // signup() {
    //   axios
    //     .post("/accounts:signUp?key=AIzaSyA0r4Fex7Ju0C-9z7W0_goOKibJncOb1Gc", {
    //       email: this.email,
    //       password: this.password,
    //       returnSecureToken: true,
    //     })
    //     .then((response) => console.log(response));
    //   this.email = "";
    //   this.password = "";
    // },
  },
};
</script>

<style scoped>
.signup-form {
  margin: 150px;
  padding: 30px;
}
.signup-box {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
}
.signup-title {
  display: inline-block;
}
.error-msg {
  margin-top: 20px;
}
</style>
