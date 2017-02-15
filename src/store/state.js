function flattern(blocks) {
    const blocksDict = {};
    const marksDict = {};
    const channelsDict = {};
    const elesDict = {};
    blocks.forEach((block, bidx) => {
        const markIds = [];
        block.marks.forEach((mark, midx) => {
            const channelIds = [];
            mark.channels.forEach((channel, cidx) => {
                const eleIds = [];
                channel.attachedEles.forEach((ele, eidx) => {
                    ele.id = `bid${bidx}_mid${midx}_cid${cidx}_eid${eidx}`;
                    elesDict[ele.id] = ele;
                    eleIds.push(ele.id);
                });
                channel.id = `bid${bidx}_mid${midx}_cid${cidx}`;
                channelsDict[channel.id] = channel;
                channelIds.push(channel.id);
                channel.attachedEles = eleIds;
            });
            mark.id = `bid${bidx}_mid${midx}`;
            marksDict[mark.id] = mark;
            markIds.push(mark.id);
            mark.channels = channelIds;
        });
        block.id = `bid${bidx}`;
        blocksDict[block.id] = block;
        block.marks = markIds;
    });
    return {
        blocks: blocksDict,
        marks: marksDict,
        channels: channelsDict,
        eles: elesDict,
    };
}

const blocks = [{
    name: 'block1',
    parent: ['root'],
    children: [],
    selected: true,
    marks: [{
        name: 'mark11',
        channels: [{
            name: 'channel111',
            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,
            removed: false,
            block: 'node',
            mark: 'node',
            channel: 'position',
        }, {
            name: 'channel112',
            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,
            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'position',
        }, {
            name: 'channel113',
            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,

            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'color',
        }],
    }, {
        name: 'mark12',
        channels: [{
            name: 'channel121',
            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,
            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'position',
        }, {
            name: 'channel122',
            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,
            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'color',
        }],
    }],
}, {
    name: 'block2',
    parent: ['block1'],
    children: [],
    selected: false,
    marks: [{
        name: 'mark21',
        channels: [{
            name: 'channel 211',
            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,

            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'color',
        }, {
            name: 'channel 212',
            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,
            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'position',
        }, {
            name: 'channel 213',
            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,

            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'color',
        }],
    }, {
        name: 'mark22',
        channels: [{
            name: 'channel221',
            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,
            removed: false,
            block: 'node',
            mark: 'node',
            channel: 'position',
        }, {
            name: 'channel222',
            attachedEles: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,
            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'position',
        }, {
            name: 'channel223',
            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,

            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'color',
        }, {
            name: 'channel224',
            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,

            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'color',
        }],
    }],
}, {
    name: 'block3',
    parent: ['block1'],
    children: [],
    selected: false,
    marks: [{
        name: 'mark31',
        channels: [{
            name: 'channel 311',
            attachedEles: [{ i: 0, x: 310, y: 201, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 332, y: 112, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
            selected: false,

            removed: false,
            block: 'theme river',
            mark: 'strip',
            channel: 'color',
        }],
    }],
}];

const state = {
    selectedBlockId: 'bid0',
    selectedMarkId: null,
    selectedChannelId: null,
    selectedEleId: null,
    ...flattern(blocks),
    figureSource: [{ i: 0, x: 100, y: 219, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }, { i: 1, x: 202, y: 129, path: '', selected: false, description: { text: 'description', dx: 0, dy: 0 } }],
    // selectedIndex: '',
};
export default state;
