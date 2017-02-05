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
        state.selectedItem = item;
        state.selectedIndex = state.items.indexOf(item);
    },
    [EDIT_ITEM](state, message) {
        // console.info(message);
        const i = state.items.indexOf(state.selectedItem);
        state.items[i].content = message;
    },
    [UPDATE_ITEM](state, items) {
        state.items = items;
    },
};

export default mutations;
