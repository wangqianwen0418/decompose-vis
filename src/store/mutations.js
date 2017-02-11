import {
    ADD_ITEM,
    REMOVE_ITEM,
    SELECT_ITEM,
    EDIT_ITEM,
    UPDATE_ITEM,
} from './types';


const mutations = {
    [ADD_ITEM](state) {
        state.items.push(state.newItem);
    },
    [REMOVE_ITEM](state, item) {
        item.removed = true;
    },
    [SELECT_ITEM](state, item) {
        const blocks = state.blocks;
        blocks.forEach((block) => {
            block.marks.forEach((mark) => {
                mark.channels.forEach((channel) => {
                    channel.selected = false;
                });
            });
        });
        item.selected = true;
    },
    [EDIT_ITEM](state, message) {
        const selectedItem = state.items.filter(item => item.selected);
        const eles = selectedItem[0].attachedEles;
        const selectedEle = eles.filter(ele => ele.selected)[0];
        selectedEle.description.text = message;
    },
    [UPDATE_ITEM](state, items) {
        state.items = items;
    },
};

export default mutations;
