const getters =
    {
        selectedBlock:
        (state) => {
            let block = null;
            state.blocks.forEach((blk) => {
                if (blk.selected) block = blk;
            });
            return block;
        },
        selectedItem:
        (state) => {
            let item = null;
            state.blocks.forEach((block) => {
                block.marks.forEach((mark) => {
                    mark.channels.forEach((channel) => {
                        if (channel.selected) { item = channel; }
                    });
                });
            });
            return item;
        },
        selectedEle:
        (state) => {
            let returnEle = null;
            state.blocks.forEach((block) => {
                block.marks.forEach((mark) => {
                    mark.channels.forEach((channel) => {
                        if (channel.selected) {
                            channel.attachedEles.forEach((ele) => {
                                if (ele.selected) returnEle = ele;
                            });
                        }
                    });
                });
            });
            return returnEle;
        },
    };

export default getters;
