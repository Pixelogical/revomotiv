<template>
    <img alt="Vue logo" src="./assets/logo.svg" width="80">

    <h1>likes : {{clikes}}</h1>
    <!-- <button v-if="!authenticated">Sign In</button> -->
    <div class="auth" v-if="!authenticated">
      <input v-model="username" type="text">
      <input v-model="password" type="password">
      <button @click="handleSignIn">Submit</button>
    </div>
    <h1>User is : {{$store.state.user ? $store.state.user.name : "not Logged in"}}</h1>

    <input v-model="text" @keypress.enter="create()" type="text" placeholder="زن، زندگی، آزادی">
    <button v-on:click="create()" :disabled="!authenticated">POST</button>
    <div> Total Votes :{{this.$store.getters.getTotalVotes}}</div>
    <Card msg="Welcome to Your Vue.js App" test="asdsa" />
    <TransitionGroup name="list" tag="div" class="wrapper">
      <Card v-for="card in cCards" :test="card" :key="card.like" />
    </TransitionGroup>
    <!-- <div>{{$store.state.user}}</div> -->
</template>

<script>
import { inject } from 'vue'
import store from './store'
import { v4 as uuidv4 } from 'uuid';

import Card from './components/Card.vue'
import axios from 'axios'



export default {
  name: 'App',
  components: {
    Card
  },
  computed: {
    authenticated() {
      if (this.$store.state.user != null && this.$store.state.user.id != "") {
        return true
      } else {
        return false
      }
    },
    clikes() {
      console.log(this.$store.state.posts);
      let count = 0

      for (let i = 0; i < this.$store.state.posts.length; i++) {
        count += this.$store.state.posts[i].like;
      }
      return count
    },
    cCards() {
      this.$store.state.posts.sort(function (first, second) {
        return second.like - first.like;
      });
      return this.$store.state.posts
    }
  },
  mounted: async function () {
    //check login
    const logged = this.$cookies.get('user');
    if (logged != null) {
      fetch(' http://192.168.1.103:3000/users/' + logged.id, {
        method: 'GET',
      }).then(response => response.json()).then(datas => {
        if (datas.id != null) {
          this.$store.commit('fetchUser', datas)
        } else {
          this.$store.commit('fetchUser', {
            name: "",
            liked: [],
            id: ""
          })
        }
      })
    } else {
      this.$store.commit('fetchUser', {
        name: "",
        liked: [],
        id: ""
      })
    }

    //load posts
    fetch(' http://192.168.1.103:3000/posts?_sort=like&_order=desc', {
      method: 'GET',
    }).then(response => response.json()).then(datas => datas.forEach(data => {
      this.cards.push(data)
    }))
    this.$store.commit('updatePosts', this.cards)


  },
  created() {
  },
  data: function () {
    return {
      text: "",
      cards: [],
      user: String(this.$store.getters.getUser),
      username: "",
      password: "",
    }
  },
  methods: {
    create: async function () {

      fetch(' http://192.168.1.103:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: uuidv4(),
          content: this.text,
          like: 0
        })
      }).then(response => response.json()).then(datas => {
        this.$store.state.user.posts.push(datas.id)
        this.cards.push(datas)
        this.cards = [...this.cards]
        fetch(' http://192.168.1.103:3000/users/' + this.$store.state.user.id, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            posts: this.$store.state.user.posts
          })
        })
      })
    },
    handleSignIn: async function () {

      fetch(' http://192.168.1.103:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: uuidv4(),
          name: this.username,
          password: this.password,
          liked: [],
        })
      }).then(response => response.json()).then(datas => {
        if (datas.id != null) {
          this.$cookies.set('user', datas);
          this.$store.commit('fetchUser', datas)
        }
      })

      // this.$cookies.remove('user')
      // authenticated


      // console.log(this.$cookies.remove('user'));

      // console.log(this.$cookies.set('user'),{
      //   asas:"asas"
      // });

    },
  },
  watch: {
    // cards: function (newVal, oldVal) {
    //   newVal.sort(function (first, second) {
    //     return second.like - first.like;
    //   });
    // },
  },
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
body{
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
}
.blur {
  background: rgba(255, 255, 255, 0.2); 
  backdrop-filter: blur(8px); 
  height: 100vh;
	width: 100%;
  position: absolute;
  z-index: -1;

}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  width: 80%;
  flex-direction: column;
  background: #dee9fcc7;
  box-shadow: rgba(0, 0, 0, 0.231) 5px 0px 20px -5px;
  height: 90vh;
  border-radius: 10px;
  overflow: hidden;
  padding: 15px;
}
.wrapper{
  overflow-y: scroll;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>