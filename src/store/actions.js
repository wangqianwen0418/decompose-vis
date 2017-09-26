import {
    // ADD_CHANNEL,
    // ADD_MARK,
    // REMOVE_CHANNEL,
    // REMOVE_MARK,
    SELECT_CHANNEL,
    EDIT_ELE,
    UPDATE_BLOCK,
    UPDATE_BLOCKS,
    SELECT_BLOCK,
    EDIT_EXP,
    UPDATE_CHANNEL,
} from './types';

const actions = {
    // [ADD_CHANNEL]({ commit }, channelTemp) {
    //     commit(ADD_CHANNEL, channelTemp);
    // },
    // [REMOVE_CHANNEL]({ commit }, item) {
    //     commit(REMOVE_CHANNEL, item);
    // },
    // [ADD_MARK]({ commit }, markTemp) {
    //     commit(ADD_MARK, markTemp);
    // },
    // [REMOVE_MARK]({ commit }, mark) {
    //     commit(REMOVE_CHANNEL, mark);
    // },
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
    [UPDATE_BLOCK]({ commit }, block) {
        commit(UPDATE_BLOCK, block);
    },
    [UPDATE_CHANNEL]({ commit }, items) {
        commit(UPDATE_CHANNEL, items);
    },
};

export default actions;
