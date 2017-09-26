import {
    // ADD_CHANNEL,
    // REMOVE_CHANNEL,
    // ADD_MARK,
    // REMOVE_MARK,
    SELECT_CHANNEL,
    EDIT_ELE,
    UPDATE_BLOCK,
    UPDATE_BLOCKS,
    SELECT_BLOCK,
    UPDATE_CHANNEL,
    EDIT_EXP,
} from './types';

function applyChannel(status, channel) {
    if (channel.name === "color-h") {
        status.hue = 0;
    } else if (channel.name === "color-s") {
        status.sat = 0;
    } else if (channel.name === "size") {
        status.size = 0;
    } else if (channel.name === "position") {
        status.length = 0;
    }
}

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
                        ch.selected = true;
                        if (ch.img) {
                            const img = document.getElementsByClassName('editorIMG')[0];
                            img.src = ch.img;
                        } else {
                            // mark.canvas.render(i);
                        }
                    } else {
                        ch.selected = false;
                    }
                });
            });
        });
        // channel.selected = true;
    },
    [UPDATE_CHANNEL](state, channels) {
        state.blocks.forEach((blk, blkIndex) => {
            if (blk.selected) {
                for (var i = channels.length - 1; i >= 0; --i) {
                    channels[i].nextStatus = i === channels.length - 1 ? blk.endStatus : channels[i + 1].status;
                    channels[i].status = JSON.parse(JSON.stringify(channels[i].nextStatus));
                    if (channels[i].animations.length > 0) {
                        applyChannel(channels[i].status[blkIndex], channels[i]);
                    }
                }
                blk.marks[0].channels = channels;
            }
        });
    },
    [UPDATE_BLOCK](state, blocks) {
        state.blocks = blocks;
    },
    [SELECT_BLOCK](state, block) {
        state.blocks.forEach((blk) => {
            blk.selected = false;
        });
        block.selected = true;
    },
    [EDIT_ELE](state, message) {
        state.blocks.forEach((block) => {
            block.marks.forEach((mark) => {
                mark.channels.forEach((channel) => {
                    channel.animations.forEach((ani) => {
                        if (ani.selected) {
                            ani.annotation.text = message.text;
                            ani.annotation.x = message.x;
                            ani.annotation.y = message.y;
                        }
                    });
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
