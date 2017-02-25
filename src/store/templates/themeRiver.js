const themeRiver =
    {
        name: 'streamGraph',
        parent: ['root'],
        children: [],
        selected: false,
        marks: [{
            name: 'area',
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
                annotations: ['w1', 'annotation', 'w2', 'annotation', 'h1', 'annotation', 'h2'],
                annotation: ['the start point of the stream corrensponds to xxxx',
                    'the end point of the stream corrensponds to xxxx',
                    'narrow width indicates xxxx',
                    'wide width indicates xxx'],
                explanation: 'the length means xxxx, the width is encoded with xxx',
            }, {
                name: 'shape',
                selected: false,
                removed: false,
                attachedEles: [],
                animations: ['connecting', 'annotation'],
                annotations: [''],
                explanation: 'merging and splitting show the topic envolution',
            }],
        }],
    };
export default themeRiver;
