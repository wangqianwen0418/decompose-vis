import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
});

export {
    // ADD_CHANNEL,
    // REMOVE_CHANNEL,
    // ADD_MARK,
    // REMOVE_MARK,
    SELECT_CHANNEL,
    EDIT_ELE,
    UPDATE_BLOCKS,
    SELECT_BLOCK,
    EDIT_EXP,
    UPDATE_CHANNEL,
} from './types';
