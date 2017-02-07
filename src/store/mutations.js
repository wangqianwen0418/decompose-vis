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
        const index = state.items.indexOf(item);
        state.items.splice(index, 1);
    },
    [SELECT_ITEM](state, item) {
        state.items.forEach((i) => {
            i.selected = false;
        });
        item.selected = true;
    },
    [EDIT_ITEM](state, message) {
        // console.info(message);
        const selectedItem = state.items.filter(item => item.selected)[0];
        // const i = state.items.indexOf(selectedItem);
        selectedItem.content = message;
    },
    [UPDATE_ITEM](state, items) {
        state.items = items;
    },
};

export default mutations;
