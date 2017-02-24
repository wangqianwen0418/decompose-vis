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
        selectedChannel:
        (state) => {
            let channel = null;
            state.blocks.forEach((block) => {
                block.marks.forEach((mark) => {
                    mark.channels.forEach((ch) => {
                        if (ch.selected) { channel = ch; }
                    });
                });
            });
            return channel;
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
        bTree:
        (state) => {
            // function findChild(node) {
            //     // const returnNode = {};
            //     // returnNode.name = node.name;
            //     // returnNode.parent = node.parent;
            //     const children = node.children;
            //     const returnChildren = [];
            //     children.forEach((childName) => {
            //         state.blocks.forEach((nd) => {
            //             if (nd.name === childName) { returnChildren.push(nd); }
            //         });
            //     });
            //     // returnNode.child = returnChildren;
            //     return returnChildren;
            // }
            let index = 0;

            function insertChildren(node) {
                state.blocks.forEach((blk) => {
                    if (blk.parent[0] === node.name) {
                        const copy = {};
                        copy.name = blk.name;
                        copy.parent = blk.parent;
                        copy.children = [];
                        copy.selected = blk.selected;
                        copy.index = index;
                        blk.index = index;
                        index += 1;
                        copy.marks = blk.marks;
                        node.children.push(copy);
                        insertChildren(copy);
                    }
                });
            }

            const bTree = {
                name: 'root',
                parent: [],
                children: [],
            };

            insertChildren(bTree);
            return bTree;
        },

        sortedBlocks:
        (state) => {
            let index = 0;

            function insertChildren(node) {
                state.blocks.forEach((blk) => {
                    if (blk.parent[0] === node.name) {
                        const copy = {};
                        copy.name = blk.name;
                        copy.parent = blk.parent;
                        copy.children = [];
                        copy.selected = blk.selected;
                        copy.index = index;
                        blk.index = index;
                        index += 1;
                        copy.marks = blk.marks;
                        node.children.push(copy);
                        insertChildren(copy);
                    }
                });
            }

            const bTree = {
                name: 'root',
                parent: [],
                children: [],
            };

            insertChildren(bTree);
            return state.blocks.sort((a, b) => a.index - b.index);
        },

    };

export default getters;
