const dountChart = {
    name: 'dountChart',
    parent: ['root'],
    children: [],
    selected: true,
    marks: [{
        name: 'arc',
        removed: false,
        channels: [{
            name: 'color-h',
            more: 'hue',
            selected: false,
            removed: false,
            attachedEles: [],
            animations: ['fill', 'annotation'], // fill color one by one
            annotations: ['the color xxxx means xxxx'],
            explanation: 'one color stands for one category',
        }, {
            name: 'color-s', // s for saturation
            more: '',
            selected: false,
            removed: false,
            attachedEles: [],
            animations: ['s-decrease', 'annotation', 's-increase', 'annotation'], // fill color one by one
            annotations: ['low saturation means xxxx', 'high saturation means xxxx'],
            explanation: ' color saturation indicates xxxx',
        }, {
            name: 'size',
            more: 'w-theta',
            selected: false,
            removed: false,
            attachedEles: [],
            annotations: ['w-1', 'annotation', 'w2', 'annotation', 'theta1', 'annotation', 'theta2', 'annotation'],
            annotation: ['narrow width corrensponds to xxxx',
                'wild width corrensponds to xxxx',
                'small theta means xxx',
                'large theta means xxx'],
            explanation: '',
        }],
    }],
};
export default dountChart;
