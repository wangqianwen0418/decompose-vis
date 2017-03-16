const grid = {
    name: 'grid',
    parent: ['a vis'],
    children: [],
    selected: false,
    marks: [{
        name: 'area',
        removed: false,
        channels: [{
            name: 'position',
            more: 'r-theta',
            selected: false,
            removed: false,
            attachedEles: [],
            animations: ['theta', 'anotation', 'r', 'anotation'], // the  first ele move at x-direction, then move at y-direction, the all eles show at their position
            annotations: ['', ''],
            explanation: 'r means xxx,/n theta means xxx',
        }, {
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
            more: 'w-h',
            selected: false,
            removed: false,
            attachedEles: [],
            annotations: ['w1', 'annotation', 'w2', 'annotation', 'h1', 'annotation', 'h2', 'annotation'],
            annotation: ['the start point of the stream corrensponds to xxxx',
                'the end point of the stream corrensponds to xxxx',
                'narrow width indicates xxxx',
                'wide width indicates xxx'],
            explanation: 'the length means xxxx, the width is encoded with xxx',
        }],
    }],
};
export default grid;
