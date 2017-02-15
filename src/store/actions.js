import {
    ADD_CHANNEL,
    REMOVE_CHANNEL,
    SELECT_CHANNEL,
    UPDATE_BLOCKS,
    SELECT_BLOCK,
    SELECT_ELE,
    EDIT_SELECTED_ELE,
} from './types';

const actions = {
    [ADD_CHANNEL]({ commit }) {
        commit(ADD_CHANNEL);
    },
    [REMOVE_CHANNEL]({ commit }, channel) {
        commit(REMOVE_CHANNEL, channel);
    },
    [SELECT_CHANNEL]({ commit }, channel) {
        commit(SELECT_CHANNEL, channel);
    },
    [SELECT_BLOCK]({ commit }, block) {
        commit(SELECT_BLOCK, block);
    },
    [UPDATE_BLOCKS]({ commit }, blocks) {
        commit(UPDATE_BLOCKS, blocks);
    },
    [SELECT_ELE]({ commit }, ele) {
        commit(SELECT_ELE, ele);
    },
    [EDIT_SELECTED_ELE]({ commit }, playload) {
        commit(EDIT_SELECTED_ELE, playload);
    },
};

export default actions;
