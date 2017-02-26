import templates from './templates';

const state = {
    blocks: templates,
    temps: templates,
    marksTemp: [
        {
            name: 'point',
            channels: [],
        }, {
            name: 'line',
            channels: [],
        }, {
            name: 'area',
            channels: [],
        },
    ],
    channelsTemp: [
        {
            name: 'positon',

        }, {
            name: 'color-s',
        }, {
            name: 'color-h',

        }, {
            name: 'size',

        }, {
            name: 'shape',

        },
    ],
};
export default state;
