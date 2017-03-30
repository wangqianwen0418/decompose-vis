import {
    // ADD_CHANNEL,
    // REMOVE_CHANNEL,
    // ADD_MARK,
    // REMOVE_MARK,
    SELECT_CHANNEL,
    EDIT_ELE,
    UPDATE_BLOCKS,
    SELECT_BLOCK,
    UPDATE_CHANNEL,
    EDIT_EXP,
} from './types';
import { Animation } from '../canvas/object';


const mutations = {
    // [ADD_CHANNEL](state, channelTemp) {
    //     state.blocks.forEach((block) => {
    //         // block.marks.forEach((mark) => {
    //             // mark.channels.forEach((ch) => {
    //         if (block.selected) { block.marks[0].channels.push(channelTemp); }
    //             // });
    //         // });
    //     });
    // },
    // [REMOVE_CHANNEL](state, channel) {
    //     channel.removed = true;
    // },
    // [ADD_MARK](state, markTemp) {
    //     state.blocks.forEach((blk) => {
    //         if (blk.selected) { blk.marks.push(markTemp); }
    //     });
    //     console.info('hhhhh');
    // },
    // [REMOVE_MARK](state, mark) {
    //     mark.removed = true;
    // },
    [SELECT_CHANNEL](state, channel) {
        const blocks = state.blocks;
        blocks.forEach((block) => {
            block.marks.forEach((mark) => {
                mark.channels.forEach((ch, i) => {
                    if (ch === channel) {
                        console.info(ch);
                        ch.selected = true;
                        mark.canvas.render(i);
                    } else {
                        ch.selected = false;
                    }
                });
            });
        });
        // channel.selected = true;
    },
    [UPDATE_CHANNEL](state, channels) {
        const len = channels.length;
        const canvas = channels[0].parent.canvas;
        canvas.itemTables = new Array(len + 1);
        canvas.itemTables[len] = canvas.items;
        const n = canvas.items.length;
        for (let i = len - 1; i >= 0; --i) {
            channels[i].index = i;
            canvas.itemTables[i] = new Array(n);
            for (let j = 0; j < n; ++j) {
                canvas.itemTables[i][j] =
                    Animation.initialStatus(canvas.itemTables[i + 1][j], channels[i].name);
            }
        }
    },
    [SELECT_BLOCK](state, block) {
        state.blocks.forEach((blk) => {
            blk.selected = false;
        });
        console.info(block);
        block.canvas.render();
        block.selected = true;
    },
    [EDIT_ELE](state, message) {
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
    [EDIT_EXP](state, exp) {
        state.blocks.forEach((block) => {
            block.marks.forEach((mark) => {
                mark.channels.forEach((channel) => {
                    if (channel.selected) {
                        channel.explanation = exp;
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
