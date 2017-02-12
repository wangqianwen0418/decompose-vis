const state = {
    newItem: {
        content: 'be new new new',
        attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
        selected: false,
        removed: false,
        block: 'node',
        mark: 'node',
        channel: 'position',
    },
    blocks: [
        {
            name: 'block1',
            selected: true,
            marks: [
                {
                    name: 'mark11',
                    channels: [
                        {
                            name: 'channel111',
                            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,
                            removed: false,
                            block: 'node',
                            mark: 'node',
                            channel: 'position',
                        },
                        {
                            name: 'channel112',
                            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,
                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'position',
                        },
                        {
                            name: 'channel113',
                            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,

                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'color',
                        },
                    ],
                },
                {
                    name: 'mark12',
                    channels: [
                        {
                            name: 'channel121',
                            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,
                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'position',
                        },
                        {
                            name: 'channel122',
                            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,
                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'color',
                        },
                    ],
                }],
        },
        {
            name: 'block2',
            selected: false,
            marks: [
                {
                    name: 'mark21',
                    channels: [
                        {
                            name: 'channel 211',
                            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,

                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'color',
                        },
                        {
                            name: 'channel 212',
                            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,
                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'position',
                        },
                        {
                            name: 'channel 213',
                            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,

                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'color',
                        },
                    ],
                },
                {
                    name: 'mark22',
                    channels: [
                        {
                            name: 'channel221',
                            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,
                            removed: false,
                            block: 'node',
                            mark: 'node',
                            channel: 'position',
                        },
                        {
                            name: 'channel222',
                            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,
                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'position',
                        },
                        {
                            name: 'channel223',
                            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,

                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'color',
                        },
                        {
                            name: 'channel224',
                            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,

                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'color',
                        },
                    ],
                }],
        },
    ],
    figureSource: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
    // selectedItem: {},
    // selectedIndex: '',
};
export default state;
