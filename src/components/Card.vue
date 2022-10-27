<template>
  <div :class="hello">
    <h1>{{ test.content }}</h1>

    <button v-if="!isLiked" v-on:click="increase()" class="plus" :disabled="!loggedIn">+</button>
    <button v-if="isLiked" v-on:click="decrease()" class="plus">-</button>

    <span class="result">{{test.like}}</span>
    <span>liked by you {{user}}</span>

  </div>
</template>

<script>
import { firebaseApp, db, collection, getDocs, doc, onSnapshot } from '../firebaseConfig'
import { query, where, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { async } from '@firebase/util';

export default {
  name: 'Card',
  props: {
    msg: String,
    test: String,
    user: Object,
  },
  computed: {
    hello() {
      if (this.$store.state.user.liked.indexOf(this.test.id) != -1) {
        return "hello my-post"
      } else {
        return "hello"
      }
    },
    isLiked() {
      if (this.$store.state.user.liked.indexOf(this.test.id) != -1) {
        return true
      } else {
        return false
      }
    },
    loggedIn() {
      if (this.$store.state.user.id != "") {
        return true
      } else {
        return false
      }
    }
  },
  mounted: function () {

  },
  data: function () {
    return {
      result: 0,
      my_post: "sss",
    }
  },
  methods: {
    increase: async function () {

      if (!this.isLiked) {
        this.test.like += 1
        this.$store.state.user.liked.push(this.test.id)
        this.updateLike()
      }
      //asas
      // this.$store.commit("changeVote", this.$store.getters.getTotalVotes + 1)
    },
    decrease: async function () {
      if (this.isLiked) {
        this.test.like -= 1
        this.$store.state.user.liked = this.$store.state.user.liked.filter(item => item != this.test.id)
        this.updateLike()
      }
    },

    updateLike: async function () {
      const post = doc(db, "posts", this.test.id);
      await updateDoc(post, {
        like: this.test.like
      });
      const user = doc(db, "users", this.$store.state.user.id);
      await updateDoc(user, {
        liked: this.$store.state.user.liked
      });
      console.log('done');

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  background-color: #42b983;
  margin: 10px auto;
  position: relative;
  height: 50px;
  transition: all 0.1s ease;
}

.my-post {
  border: 2px solid red;
}

.hello button {
  position: absolute;
  left: 0;
  padding: 2px 5px;
  width: 20px;
}

.result {
  position: absolute;
  left: 50px;
  top: 35%;
}

.plus {
  top: 0;
}

.minus {
  bottom: 0;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
