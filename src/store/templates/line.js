    const line = {
        name: 'line',
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
                explanation: 'x position means _, y position means _',
                img: require('assets/line/1.png'),
            }, {
                name: 'color',
                more: 'hue',
                selected: false,
                removed: false,
                attachedEles: [],
                animations: ['fill', 'annotation'], // fill color one by one
                annotations: ['the color xxxx means xxxx'],
                explanation: 'one color stands for one category',
                img: require('assets/line/3.png'),
            }, {
                name: 'shape',
                more: '', // intensity for dooted line, amplitude for wavy line
                selected: false,
                removed: false,
                attachedEles: [],
                animations: ['transition', 'annotation'], // for one ele, the mean of less length, of more length, of less width, of more width
                annotations: [''],
                explanation: 'Wave effect means the keyword correlation',
                img: require('assets/line/4.png'),
            }],
        }] };

    export default line;
