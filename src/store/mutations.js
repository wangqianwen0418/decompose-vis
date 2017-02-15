import {
    REMOVE_CHANNEL,
    SELECT_CHANNEL,
    EDIT_CHANNEL,
    UPDATE_BLOCKS,
    SELECT_BLOCK,
} from './types';


const mutations = {
    [REMOVE_CHANNEL](state, channel) {
        channel.removed = true;
    },
    [SELECT_CHANNEL](state, channel) {
        // maybe the field `selected` is unnecessary -- by czt
        // const blocks = state.blocks;
        // blocks.forEach((block) => {
        //     block.marks.forEach((mark) => {
        //         mark.channels.forEach((channel) => {
        //             channel.selected = false;
        //         });
        //     });
        // });
        // CHANNEL.selected = true;
        state.selectedChannel = channel;
    },
    [SELECT_BLOCK](state, block) {
        // maybe the field `selected` is unnecessary -- by czt
        // state.blocks.forEach((blk) => {
        //     blk.selected = false;
        // });
        // block.selected = true;
        state.selectedBlock = block;
    },
    [EDIT_CHANNEL](state, message) {
        state.blocks.forEach((block) => {
            block.marks.forEach((mark) => {
                mark.channels.forEach((channel) => {
                    if (channel.selected) {
                        channel.attachedEles.forEach((ele) => {
                            if (ele.selected) { ele.description.text = message; }
                        });
                    }
                });
            });
        });
    },
    [UPDATE_BLOCKS](state, blocks) {
        state.blocks = blocks;
    },
};

export default mutations;
