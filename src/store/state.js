const state = {
    blocks: [],
    temps: [],
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
            name: 'position',
            more: 'x-y',
            selected: false,
            removed: false,
            attachedEles: [],
            animations: ['x1', 'anotation', 'x2', 'anotation', 'y-move', 'anotation', 'appear-all'], // the  first ele move at x-direction, then move at y-direction, the all eles show at their position
            annotations: ['start point means xxxxx', 'end point means xxxx', 'y position means xxxxx'],
            explanation: 'x position means _, y position means _',
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
