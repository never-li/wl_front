const loadingDiv = {
  state: {
    loadingDiv: [],
    key: 0
  },
  mutations: {
    ADD_LOADINGDIV: (state) => {
      state.loadingDiv.push(state.key++)
    },
    DEL_LOADINGDIV: (state) => {
      if (state.loadingDiv.length > 0) {
        state.loadingDiv.splice(state.loadingDiv.length - 1, 1)
      }
    },
    DEL_ALL_LOADINGDIV: (state) => {
      state.loadingDiv = []
    }
  },
  actions: {
    addLoadingDiv({ commit }) {
      commit('ADD_LOADINGDIV')
    },
    delLoadingDiv({ commit }) {
      commit('DEL_LOADINGDIV')
    },
    delAllLoadingDiv({ commit }) {
      commit('DEL_ALL_LOADINGDIV')
    }
  }
}

export default loadingDiv
