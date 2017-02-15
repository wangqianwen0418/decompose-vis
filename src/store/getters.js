const getters = {
    selectedBlock: state => state.blocks[state.selectedBlockId],
    selectedMarks: state => state.marks[state.selectedMardId],
    selectedChannel: state => state.channels[state.selectedChannelId],
    selectedEle: state => state.eles[state.selectedEleId],
    bTree: (state) => {
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
        const blocksArr = Object.keys(state.blocks).map(k => state.blocks[k]);

        function insertChildren(node) {
            blocksArr.forEach((blk) => {
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
    sortedBlocks: (state) => {
        let index = 0;
        const blocksArr = Object.keys(state.blocks).map(k => state.blocks[k]);
        function insertChildren(node) {
            blocksArr.forEach((blk) => {
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
        return blocksArr.sort((a, b) => a.index - b.index);
    },
};

export default getters;
