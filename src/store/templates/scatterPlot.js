const scatterPlot = {
    name: 'scatter plot',
    parent: ['a vis'],
    children: [],
    selected: false,
    marks: [{
        name: 'point',
        removed: false,
        channels: [{
            name: 'position',
            more: 'x-y',
            selected: false,
            removed: false,
            attachedEles: [],
            animations: ['x-move', 'anotation', 'y-move', 'anotation', 'appear-all'], // the  first ele move at x-direction, then move at y-direction, the all eles show at their position
            annotations: ['x position means xxxxx', 'y position means xxxxx'],
            explanation: 'x position means xxx, y position means xxx',
        }, {
            name: 'color-h',
            more: '',
            selected: false,
            removed: false,
            attachedEles: [],
            animations: ['fill'],
            explanation: '',
        }, {
            name: 'color-s',
            more: '',
            selected: false,
            removed: false,
            attachedEles: [],
            animations: ['fill'],
            explanation: '',
        }, {
            name: 'size',
            more: 'scale',
            selected: false,
            removed: false,
            attachedEles: [],
            animations: ['scale-less', 'annotation', 'scale-more', 'annotation'],
            annotations: ['small size means xxx', 'large size means xxxxx'],
            explanation: '',
        }, {
            name: 'shape',
            selected: false,
            removed: false,
            attachedEles: [],
            animations: ['transition'],
            explanation: 'one shape is for one category',
        }],
    }],
};
export default scatterPlot;
