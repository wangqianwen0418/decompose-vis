import {
    ADD_CHANNEL,
    REMOVE_CHANNEL,
    SELECT_CHANNEL,
    EDIT_ELE,
    UPDATE_BLOCKS,
    SELECT_BLOCK,
    EDIT_EXP,
} from './types';

const actions = {
    [ADD_CHANNEL]({ commit }) {
        commit(ADD_CHANNEL);
    },
    [REMOVE_CHANNEL]({ commit }, item) {
        commit(REMOVE_CHANNEL, item);
    },
    [SELECT_CHANNEL]({ commit }, item) {
        commit(SELECT_CHANNEL, item);
    },
    [SELECT_BLOCK]({ commit }, block) {
        commit(SELECT_BLOCK, block);
    },
    [EDIT_ELE]({ commit }, text) {
        commit(EDIT_ELE, text);
    },
    [EDIT_EXP]({ commit }, text) {
        commit(EDIT_EXP, text);
    },
    [UPDATE_BLOCKS]({ commit }, blocks) {
        commit(UPDATE_BLOCKS, blocks);
    },
};

export default actions;
