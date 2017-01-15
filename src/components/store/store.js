import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const state = {
  count: 0,
  history: []
}



const store = new Vuex.Store({
  state,
  actions,
  mutations
})

export default store;