import Vue from "vue"
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    items: [],
    newItem: ""
  },

  mutations: {
    GET_ITEM(state, item) {
      state.newItem = item
    },
    ADD_Item(state) {
      state.items.push({
        content: state.newItem,
        done: false
      })
    },
    EDIT_ITEM(state, item) {
    },
    REMOVE_ITEM(state, item) {
      var items = state.items
      items.splice(items.indexOf(Item), 1)
      state.items = items
    },
    SELECT_ITEM(state, item) {
      item.done = !item.done
    },
    CLEAR_ITEM(state) {
      state.newItem = ''
    }
  },

  actions: {
    getItem({commit}, Item) {
      commit('GET_Item', Item)
    },
    addItem({commit}) {
      commit('ADD_Item')
    },
    editItem({commit}, Item) {
      commit('EDIT_Item', Item)
    },
    removeItem({commit}, Item) {
      commit('REMOVE_Item', Item)
    },
    completeItem({commit}, Item) {
      commit('COMPLETE_Item', Item)
    },
    clearItem({commit}) {
      commit('CLEAR_Item')
    },
    getters: {
      newItem: state => state.newItem,
      items: state => state.items.filter((item) => { return !todo.done }),
    }
  }
})