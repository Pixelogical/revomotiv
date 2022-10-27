<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.svg" width="80">


    <button @click="handleSignIn" v-if="!loggedIn">Sign In</button>
    <h1>User is : {{$store.state.user ? $store.state.user.name : "not Logged in"}}</h1>

    <input v-model="text" @keypress.enter="create()" type="text">
    <button v-on:click="create()" :disabled="!loggedIn">CLICK ME</button>
    <div> Total Votes :{{this.$store.getters.getTotalVotes}}</div>
    <Card msg="Welcome to Your Vue.js App" test="asdsa" />

    <Card v-for="card in cards" msg="Welcome to Your Vue.js App" :test="card"/>
    <!-- <div>{{$store.state.user}}</div> -->
  </div>
</template>

<script>
import { inject } from 'vue'

import store from './store'

import Card from './components/Card.vue'
import { firebaseApp, db, collection, getDocs, doc, onSnapshot } from './firebaseConfig'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { query, where, getDoc, setDoc,addDoc,updateDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();
const auth = getAuth()/* .createSessionCookie(idToken, 9999); */


auth.onAuthStateChanged(async user => {

  if (user != null) {
    console.log(auth.currentUser.uid)
    const snap = await getDoc(doc(db, 'users', auth.currentUser.uid))
    if (snap.exists()) {
      console.log("NICE USER LOGGED IN")
      let currentUser = snap.data()
      currentUser['id'] = snap.id
      store.commit("fetchUser", currentUser);
      console.log(store.state.user)
    } else {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        name: auth.currentUser.displayName,
        posts : [],
        liked : []
      });
      // GET USER WHEN SIGN UP
    }
  }

});


export default {
  name: 'App',
  components: {
    Card
  },
  computed: {
    async ops() {
      console.log("NEW CREATED")
      // const querySnapshot = await getDocs(collection(db, "users"));
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data());
      //   // console.log(doc);
      // });



      return this.cards
    },
    loggedIn(){
      if (this.$store.state.user.id != ""){
        return true
      }else{
        return false
      }
    }
  },
  mounted: async function () {

    //////////////
    onSnapshot(collection(db, "posts"), (querySnapshot) => {
      this.cards = []
      querySnapshot.forEach((doc) => {
        let item = doc.data()
        item['id'] = doc.id
        this.cards.push(item);
      });
    });



    // const q = query(collection(db, "users"), where("id", "==", "3Oz6gvJWlmKjW42HJqEjCA"));
    // onSnapshot(q, (querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     console.log("ASAS")
    //     console.log(doc.data())
    //   });
    // });
  },
  created() {
  },
  data: function () {
    return {
      text: "Vue.version",
      cards: [],
      user: String(this.$store.getters.getUser),
    }
  },
  methods: {
    create: async function () {
      let newPost = await addDoc(collection(db, "posts"), {
        content: this.text,
        like : 0
      })
      const user = doc(db, "users", this.$store.state.user.id);
      this.$store.state.user.posts.push(newPost.id)
      await updateDoc(user, {
        posts: this.$store.state.user.posts
      });
      
    },
    handleSignIn: function () {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
        }).catch((error) => {
        });
      // console.log(auth.currentUser)
      // this.user = String(auth.currentUser)
    },
  },
  watch: {
    text: function (newVal, oldVal) {
      if (newVal === "saeed") {
        this.cards[0] = "SAEED"
      }
      // console.log(this.cards)
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  transition: all 1s ease;
}
</style>