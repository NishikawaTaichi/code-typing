// import { initializeApp } from "firebase/app";
// import { firebaseConfig } from "./firebase/firebase-config";

// import {
//   getFirestore,
//   getDoc,
//   setDoc,
//   doc,
//   collection,
//   serverTimestamp,
// } from "firebase/firestore";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   updateProfile,
//   signOut,
// } from "firebase/auth";

// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);
// const auth = getAuth(firebaseApp);

// // export { firebaseApp };

// const signUp = (email, password, errorMsg) => {
//   createUserWithEmailAndPassword(auth, email, password, userName)
//     .then(async (response) => {
//       await updateProfile(response.user, { displayName: userName });
//       sessionStorage.message = "新規作成に成功しました";
//       this.$router.push("/login");
//     })
//     .catch((error) => {
//       console.log(error.code + "###" + error.message);
//       errorMsg = "ユーザーの新規作成に失敗しました";
//     });
// };
// const login = () => {
//   signInWithEmailAndPassword(auth, this.email, this.password)
//     .then(async (response) => {
//       const user = {
//         displayName: response.user.displayName,
//         email: response.user.email,
//         uid: response.user.uid,
//         refleshToken: response.user.refleshToken,
//       };

//       //firestoreにユーザー情報を追加
//       const userDocRef = doc(db, "users", user.uid);
//       const userDocSnap = await getDoc(userDocRef);
//       if (!userDocSnap.exists()) {
//         await setDoc(userDocRef, {
//           displayName: user.displayName,
//           uid: user.uid,
//         });
//       }
//       // sessionStorage.setItem("user", JSON.stringify(user));
//       this.$router.push("/");
//     })
//     .catch((error) => {
//       console.log(error.code + "###" + error.message);
//       this.errorMsg = "ログインに失敗しました";
//     });
// };
// const logout = () => {
//   console.log("logout");
//   const auth = getAuth();
//   signOut(auth)
//     .then(() => {
//       sessionStorage.removeItem("user");
//       sessionStorage.message = "ログアウトに成功しました";
//       this.$router.push("/login");
//     })
//     .catch((error) => {
//       console.log("error", error);
//     });
// };

// const setScore = async (user, formatedTime, accurateTyping, wpm) => {
//   const userDocRef = doc(db, "users", user.uid);
//   const userScoreDocRef = collection(userDocRef, "scores");
//   await addDoc(userScoreDocRef, {
//     time: formatedTime,
//     accuracy: accurateTyping,
//     wpm: wpm,
//     createdAt: serverTimestamp(),
//   }).catch((error) => {
//     console.log(error);
//   });
// };

// const getScores = async (user) => {
//   const userDocRef = doc(db, "users", user.uid);
//   const userScoreDocRef = collection(userDocRef, "scores");
//   const q = query(userScoreDocRef, orderBy("createdAt", "asc"));
//   const docSnap = await getDocs(q);
//   return docSnap;
// };
