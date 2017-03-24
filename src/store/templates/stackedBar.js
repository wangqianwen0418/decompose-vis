    const line = {
        name: 'StackedBar',
        parent: ['a vis'],
        children: [],
        selected: false,
        marks: [{
            name: 'line',
            removed: false,
            channels: [{
                name: 'position',
                more: 'x-y',
                selected: false,
                removed: false,
                attachedEles: [],
                animations: ['x1', 'anotation', 'x2', 'anotation', 'y-move', 'anotation', 'appear-all'], // the  first ele move at x-direction, then move at y-direction, the all eles show at their position
                annotations: ['start point means xxxxx', 'end point means xxxx', 'y position means xxxxx'],
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
                more: 'w',
                selected: false,
                removed: false,
                attachedEles: [],
                annotations: ['w1', 'annotation', 'w2', 'annotation'],
                annotation: ['the start point of the stream corrensponds to xxxx',
                    'the end point of the stream corrensponds to xxxx'],
                explanation: 'the length means xxxx, the width is encoded with xxx',
            }, {
                name: 'shape',
                more: '', // intensity for dooted line, amplitude for wavy line
                selected: false,
                removed: false,
                attachedEles: [],
                animations: ['transition', 'annotation'], // for one ele, the mean of less length, of more length, of less width, of more width
                annotations: [''],
                explanation: '',
            }],
        }] };

    export default line;
