import {
    REMOVE_CHANNEL,
    SELECT_CHANNEL,
    UPDATE_BLOCKS,
    SELECT_BLOCK,
    SELECT_ELE,
    EDIT_SELECTED_ELE,
} from './types';


const mutations = {
    [SELECT_BLOCK](state, blockId) {
        state.selectedBlockId = blockId;
    },
    [UPDATE_BLOCKS](state, blocks) {
        state.blocks = blocks;
    },
    [REMOVE_CHANNEL](state, channel) {
        channel.removed = true;
    },
    [SELECT_CHANNEL](state, channelId) {
        state.selectedChannelId = channelId;
    },
    [SELECT_ELE](state, eleId) {
        state.selectedEleId = eleId;
    },
    [EDIT_SELECTED_ELE](state, playload) {
        state.selectedEle = {
            ...state.selectedEle,
            [playload.name]: playload.value,
        };
    },
};

export default mutations;
