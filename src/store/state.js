const state = {
    blocks: [
        {
            name: 'block1',
            parent: ['root'],
            children: [],
            selected: true,
            marks: [{
                name: 'stream',
                channels: [{
                    name: 'position',
                    selected: false,
                    removed: false,
                    attachedEles: [
                    { i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } },
                    { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                    animations: ['move'],
                    explanation: 'x position means xxx, y position means xxx',
                }, {
                    name: 'color',
                    selected: false,
                    removed: false,
                    attachedEles: [
                { i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } },
                { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                    animations: ['fill'],
                    explanation: 'one color stands for one category',
                }, {
                    name: 'size',
                    selected: false,
                    removed: false,
                    attachedEles: [
                { i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } },
                { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                    animations: ['length', 'width'],
                    explanation: 'the length means xxxx, the width is encoded with xxx',
                }, {
                    name: 'shape',
                    selected: false,
                    removed: false,
                    attachedEles: [
                { i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } },
                { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                    animations: ['transition'],
                    explanation: 'merging and splitting',
                }],
            }],
        },
        {
            name: 'block2',
            parent: ['block1'],
            children: [],
            selected: false,
            marks: [
                {
                    name: 'mark21',
                    channels: [
                        {
                            explanation: '',
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
                            explanation: '',
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
        {
            name: 'block3',
            parent: ['block1'],
            children: [],
            selected: false,
            marks: [
                {
                    name: 'mark31',
                    channels: [
                        {
                            explanation: '',
                            name: 'channel 311',
                            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                            selected: false,

                            removed: false,
                            block: 'theme river',
                            mark: 'strip',
                            channel: 'color',
                        },
                    ],
                },
            ],
        },
    ],
    text: '',
    templates: [{
        name: 'streamGraph',
        parent: ['root'],
        children: [],
        selected: false,
        marks: [{
            name: 'stream',
            channels: [{
                name: 'position',
                selected: false,
                removed: false,
                attachedEles: [
                    { i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } },
                    { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                animations: ['move'],
                explanation: 'x position means xxx, y position means xxx',
            }, {
                name: 'color',
                selected: false,
                removed: false,
                attachedEles: [
                { i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } },
                { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                animations: ['fill'],
                explanation: 'one color stands for one category',
            }, {
                name: 'size',
                selected: false,
                removed: false,
                attachedEles: [
                { i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } },
                { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                animations: ['length', 'width'],
                explanation: 'the length means xxxx, the width is encoded with xxx',
            }, {
                name: 'shape',
                selected: false,
                removed: false,
                attachedEles: [
                { i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } },
                { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
                animations: ['transition'],
                explanation: 'merging and splitting',
            }],
        }],
    }, {
        name: 'node',
        marks: [{
            name: 'point',
            channels: [{
                name: 'position',
                explanation: '',
            }, {
                name: 'color',
                explanation: '',
            }, {
                name: 'size',
                explanation: '',
            }],
        }],
    }, {
        name: 'line',
        marks: [{
            name: 'line',
            channels: [{
                name: 'position',
            }, {
                name: 'color',
            }, {
                name: 'size',
            }],
        }],
    }],
    figureSource: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
    // selectedItem: {},
    // selectedIndex: '',
};
export default state;
