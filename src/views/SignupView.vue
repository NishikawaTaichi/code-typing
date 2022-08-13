<template>
  <v-card width="600px" class="mx-auto mt-5">
    <v-card-title>
      <h1 class="display-1">会員登録</h1>
    </v-card-title>
    <v-form v-model="valid" ref="form" class="padding">
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
        <v-btn class="mr-4" color="primary" @click="signup">Sign Up</v-btn>
        <v-btn @click="clear">clear</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  data: () => ({
    valid: false,
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
  }),
  methods: {
    submit() {
      console.log("送信");
      const user = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      console.log(user);
      this.$refs.form.reset();
    },
    clear() {
      this.$refs.form.reset();
    },
    signup() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((reponse) => {
          const user = reponse.user;
          console.log(user);
          this.email = "";
          this.password = "";
          this.$router.push("/login");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + "###" + errorMessage);
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

<style>
.padding {
  padding: 30px;
}
</style>
