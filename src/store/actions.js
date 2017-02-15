import {
    ADD_CHANNEL,
    REMOVE_CHANNEL,
    SELECT_CHANNEL,
    EDIT_CHANNEL,
    UPDATE_BLOCKS,
    SELECT_BLOCK,
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
    [EDIT_CHANNEL]({ commit }, text) {
        commit(EDIT_CHANNEL, text);
    },
    [UPDATE_BLOCKS]({ commit }, blocks) {
        commit(UPDATE_BLOCKS, blocks);
    },
};

export default actions;
