import templates from './templates';

const state = {
    blocks: templates,
    temps: templates,
    marksTemp: [
        {
            name: 'point',
            channels: [
                {
                    name: 'position',
                    selected: false,
                    attachedEles: [],
                }, {
                    name: 'color-s',
                    selected: false,
                    attachedEles: [],
                }, {
                    name: 'color-h',

                    selected: false,
                    attachedEles: [],

                }, {
                    name: 'size',

                    selected: false,
                    attachedEles: [],

                }, {
                    name: 'shape',

                    selected: false,
                    attachedEles: [],

                },
            ],
        }, {
            name: 'line',
            channels: [
                {
                    name: 'positon',

                    selected: false,
                    attachedEles: [],

                }, {
                    name: 'color-s',

                    selected: false,
                    attachedEles: [],
                }, {
                    name: 'color-h',

                    selected: false,
                    attachedEles: [],

                }, {
                    name: 'size',

                    selected: false,
                    attachedEles: [],

                }, {
                    name: 'shape',

                    selected: false,
                    attachedEles: [],

                },
            ],
        }, {
            name: 'area',
            channels: [],
        },
    ],
    channelsTemp: [
        {
            name: 'positon',
            selected: false,

        }, {
            name: 'color-s',
            selected: false,
        }, {
            name: 'color-h',
            selected: false,

        }, {
            name: 'size',
            selected: false,

        }, {
            name: 'shape',
            selected: false,

        },
    ],
};
export default state;
