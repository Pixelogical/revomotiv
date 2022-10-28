import { createStore } from "vuex";

export default createStore({
  state: {
    totalVotes: 0,
    user: {
      name: "",
      liked: [],
      id: "",
    },
    posts: []
  },
  getters: {
    getTotalVotes: (state) => {
      return state.totalVotes;
    },
    getUser: (state) => {
      return state.user;
    },
  },
  mutations: {
    changeVote(state, payload) {
      state.totalVotes = payload;
    },
    fetchUser(state, user) {
      state.user = user;
    },
    updatePosts(state, posts) {
      state.posts = posts;
    },
    updatePost(state, post) {
        // console.log("asasas")
        // for (let i = 0; i < state.posts.length; i++) {
        //     if (state.posts[i].id == post.id){
        //         state.posts[i].like = post.like
        //         break
        //     }
        // }
    },
  },
  actions: {},
});
