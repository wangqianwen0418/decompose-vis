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
                // console.log(channels);
                for (var i = channels.length - 1; i >= 0; --i) {
                    var animations = channels[i].animations;
                    var len = animations.length;
                    if (len == 0) continue;

                    animations[len - 1].nextStatus = null;
                    var k = i + 1;
                    for (; k < channels.length; ++k)
                        if (channels[k].animations.length > 0) {
                            animations[len - 1].nextStatus = channels[k].animations[0].status;
                            animations[len - 1].status = JSON.parse(JSON.stringify(animations[len - 1].nextStatus));
                            if (channels[k].name === "color") {
                                animations[len - 1].status[blkIndex].sat = 0;
                            }
                            if (channels[k].name === "position") {
                                animations[len - 1].status[blkIndex].position = 0.2;
                            }
                            if (channels[k].name === "size") {
                                animations[len - 1].status[blkIndex].size = 0.2;
                            }
                            break;
                        }
                    if (k == channels.length) {
                        animations[len - 1].nextStatus = JSON.parse(JSON.stringify(blk.endStatus));
                        animations[len - 1].status = JSON.parse(JSON.stringify(animations[len - 1].nextStatus));
                    }

                    for (var j = len - 1; j >= 0; --j) {
                        if (j != len - 1) {
                            animations[j].nextStatus = animations[j + 1].status;
                            if (animations[j].name == "anno" && animations[j + 1].name == "anno") {
                                animations[j].status = animations[j].nextStatus;
                            } else {
                                animations[j].status = JSON.parse(JSON.stringify(animations[j].nextStatus));
                            }
                        }
                        animations[j].duration = 1500;
                        if (animations[j].name == "fade-in") {
                            animations[j].status[blkIndex].opacity = 0;
                            animations[j].nextStatus[blkIndex].opacity = 1;
                        } else if (animations[j].name == "fade-out") {
                            animations[j].status[blkIndex].opacity = 1;
                            animations[j].nextStatus[blkIndex].opacity = 0;
                        } else if (animations[j].name == "add-color") {
                            animations[j].status[blkIndex].sat = 0;
                        } else if (animations[j].name == "change-size") {
                            animations[j].status[blkIndex].size = 0.6;
                        } else if (animations[j].name == "grow") {
                            animations[j].status[blkIndex].length = 0.2;
                        } else if (animations[j].name == "high-light") {
                            animations[j].status[blkIndex].highlight = true;
                            animations[j].duration = 3000;
                        } else if (animations[j].name == "morphing") {
                            animations[j].status[blkIndex].highlight = true;
                            animations[j].duration = 3000;
                        } else if (animations[j].name == "anno") {
                            animations[j].duration = 500;
                        }
                    }
                }
                blk.marks[0].channels = channels;
                console.log(blk.marks[0].channels);
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
