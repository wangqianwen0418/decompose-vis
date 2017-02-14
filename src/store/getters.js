const getters = {
    selectedItem: (state) => {
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
    selectedEle: (state) => {
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
    bTree: (state) => {
        function findChild(node) {
            // const returnNode = {};
            // returnNode.name = node.name;
            // returnNode.parent = node.parent;
            const children = node.children;
            const returnChildren = [];
            children.forEach((childName) => {
                state.blocks.forEach((nd) => {
                    if (nd.name === childName) { returnChildren.push(nd); }
                });
            });
            // returnNode.child = returnChildren;
            return returnChildren;
        }

        const bTree = [];
        state.blocks.forEach((node) => {
            if (!node.parent[0]) {
                const returnNode = {};
                returnNode.name = node.name;
                returnNode.parent = node.parent;
                returnNode.children = findChild(node);

                bTree.push(returnNode);
            }
        });
        return bTree;
    },
};

export default getters;
