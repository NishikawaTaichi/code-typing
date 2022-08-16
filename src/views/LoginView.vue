<template>
  <div class="login-box">
    <v-card class="login-form">
      <v-card-title class="login-title">Login</v-card-title>
      <v-card-subtitle>ログイン情報を入力してください</v-card-subtitle>
      <v-btn to="/signup" text color="light-blue">新規登録はこちら</v-btn>
      <v-form v-model="valid" ref="form">
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
            >Login</v-btn
          >
          <v-btn @click="clear">clear</v-btn>
        </v-card-actions>
        <v-alert dense outlined type="success" class="message" v-if="message">{{
          message
        }}</v-alert>
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, getDoc, setDoc, doc } from "firebase/firestore";

export default {
  data: () => ({
    valid: true,
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
    message: "",
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
      const db = getFirestore();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(async (response) => {
          this.$refs.form.reset();
          //ログイン情報をsessionに格納
          const auth = {
            displayName: response.user.displayName,
            email: response.user.email,
            uid: response.user.uid,
            refleshToken: response.user.refleshToken,
          };

          const userDocRef = doc(db, "users", auth.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
              displayName: auth.displayName,
              uid: auth.uid,
            });
          }
          sessionStorage.setItem("user", JSON.stringify(auth));
          // Topへリダイレクト
          this.$router.push("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + "###" + errorMessage);
          this.errorMsg = "ログインに失敗しました";
        });
    },
  },
  mounted() {
    if (sessionStorage.message) {
      this.message = sessionStorage.message;
      sessionStorage.message = "";
    }
  },
};
</script>

<style scoped>
.login-form {
  margin: 150px;
  padding: 30px;
}
.login-box {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
}
.login-title {
  display: inline-block;
}
.message {
  margin-top: 20px;
}
.error-msg {
  margin-top: 20px;
}
</style>
