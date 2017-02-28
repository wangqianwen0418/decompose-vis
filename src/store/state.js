import templates from './templates';

const state = {
    blocks: templates,
    temps: templates,
    marksTemp: [
        {
            name: 'point',
            removed: false,
            channels: [
                {
                    name: 'positon',
                    removed: false,
                    selected: false,
                    attachedEles: [],
                }, {
                    name: 'color-s',
                    removed: false,
                    selected: false,
                    attachedEles: [],
                }, {
                    name: 'color-h',
                    removed: false,
                    selected: false,
                    attachedEles: [],

                }, {
                    name: 'size',
                    removed: false,
                    selected: false,
                    attachedEles: [],

                }, {
                    name: 'shape',
                    removed: false,
                    selected: false,
                    attachedEles: [],

                },
            ],
        }, {
            name: 'line',
            removed: false,
            channels: [
                {
                    name: 'positon',
                    removed: false,
                    selected: false,
                    attachedEles: [],

                }, {
                    name: 'color-s',
                    removed: false,
                    selected: false,
                    attachedEles: [],
                }, {
                    name: 'color-h',
                    removed: false,
                    selected: false,
                    attachedEles: [],

                }, {
                    name: 'size',
                    removed: false,
                    selected: false,
                    attachedEles: [],

                }, {
                    name: 'shape',
                    removed: false,
                    selected: false,
                    attachedEles: [],

                },
            ],
        }, {
            name: 'area',
            removed: false,
            channels: [],
        },
    ],
    channelsTemp: [
        {
            name: 'positon',
            removed: false,
            selected: false,

        }, {
            name: 'color-s',
            removed: false,
            selected: false,
        }, {
            name: 'color-h',
            removed: false,
            selected: false,

        }, {
            name: 'size',
            removed: false,
            selected: false,

        }, {
            name: 'shape',
            removed: false,
            selected: false,

        },
    ],
};
export default state;
