    const point = {
        name: 'point',
        parent: ['a vis'],
        children: [],
        selected: false,
        marks: [{
            name: 'point',
            removed: false,
            channels: [ {
                name: 'color-h',
                more: 'hue',
                selected: false,
                removed: false,
                attachedEles: [],
                animations: ['fill', 'annotation'], // fill color one by one
                annotations: ['the color xxxx means xxxx'],
                explanation: 'one color stands for one category',
                img: require('assets/glyph/0.png'),
            }, {
                name: 'size',
                more: 'w',
                selected: false,
                removed: false,
                attachedEles: [],
                animations: ['w1', 'annotation', 'w2', 'annotation'],
                annotations: ['the start point of the stream corrensponds to xxxx',
                    'the end point of the stream corrensponds to xxxx'],
                explanation: 'Size means the importance score of this event',
                img: require('assets/glyph/1.png'),
            }, {
                name: 'shape',
                more: '', // intensity for dooted line, amplitude for wavy line
                selected: false,
                removed: false,
                attachedEles: [],
                animations: ['transition', 'annotation'], // for one ele, the mean of less length, of more length, of less width, of more width
                annotations: [''],
                explanation: 'Shape means different events',
                img: require('assets/glyph/2.png'),
            }],
        }] };

    export default point;
