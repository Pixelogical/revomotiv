import { createStore } from "vuex";

export default createStore({
  state: {
      totalVotes: 0,
      user : {
        name : "",
        liked : [],
        id : ""
      },
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
  },
  actions: {},
});

