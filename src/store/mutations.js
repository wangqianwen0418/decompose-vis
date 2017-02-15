import {
    ADD_ITEM,
    REMOVE_ITEM,
    SELECT_ITEM,
    EDIT_ITEM,
    UPDATE_BLOCKS,
    SELECT_BLOCK,
} from './types';


const mutations = {
    [ADD_ITEM](state) {
        state.items.push(state.newItem);
    },
    [REMOVE_ITEM](state, item) {
        item.removed = true;
    },
    [SELECT_ITEM](state, item) {
        // const blocks = state.blocks;
        // blocks.forEach((block) => {
        //     block.marks.forEach((mark) => {
        //         mark.channels.forEach((channel) => {
        //             channel.selected = false;
        //         });
        //     });
        // });
        // item.selected = true;
        state.selectedItem = item;
    },
    [SELECT_BLOCK](state, block) {
        // maybe the field `selected` is unnecessary
        // state.blocks.forEach((blk) => {
        //     blk.selected = false;
        // });
        // block.selected = true;
        state.selectedBlock = block;
    },
    [EDIT_ITEM](state, message) {
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
