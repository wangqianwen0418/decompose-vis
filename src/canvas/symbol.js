const defaultWidth = 64;
const defaultHeight = 64;
const defaultMargin = 5;

const triangleSize = 7;
const lengthSize = 10;
const symbolColor1 = 'steelblue';
const backgroundColor = '#eeeeee';

function symbolSizeVertical(svg, width = defaultWidth, height = defaultHeight, margin = defaultMargin) {
    const g = svg.append('g');
    g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .style('fill', backgroundColor)
        .style('stroke', 'none');

    const tri1 = g.append('g');
    
    tri1.append('polygon')
        .attr('points', `${width / 2},${margin}` +
        ` ${width / 2 - triangleSize / 2},${margin + triangleSize}` +
        ` ${width / 2 + triangleSize / 2},${margin + triangleSize}`
        )
        .style('fill', symbolColor1)
        .style('stroke', 'none')

    tri1.append('line')
        .attr('x1', width / 2)
        .attr('x2', width / 2)
        .attr('y1', margin + triangleSize)
        .attr('y2', margin + triangleSize + lengthSize)
        .style('stroke', symbolColor1)
        .style('stroke-width', 1);

    const tri2 = g.append('g');
    
    tri2.append('polygon')
        .attr('points', `${width / 2},${height - margin}` +
        ` ${width / 2 - triangleSize / 2},${height - margin - triangleSize}` +
        ` ${width / 2 + triangleSize / 2},${height - margin - triangleSize}`
        )
        .style('fill', symbolColor1)
        .style('stroke', 'none');
    
    tri2.append('line')
        .attr('x1', width / 2)
        .attr('x2', width / 2)
        .attr('y1', height - margin - triangleSize)
        .attr('y2', height - margin - triangleSize - lengthSize)
        .style('stroke', symbolColor1)
        .style('stroke-width', 1);

    function animate() {

    }

    return {
        element: g,
        animate,
    };
}

function symbolSizeHorizontal(svg, width = defaultWidth, height = defaultHeight, margin = defaultMargin) {
    const g = svg.append('g');

    g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .style('fill', backgroundColor)
        .style('stroke', 'none');

    const tri1 = g.append('g');
    
    tri1.append('polygon')
        .attr('points', `${margin},${height / 2}` +
        ` ${margin + triangleSize},${height / 2 - triangleSize / 2}` +
        ` ${margin + triangleSize},${height / 2 + triangleSize / 2}`
        )
        .style('fill', symbolColor1)
        .style('stroke', 'none');

    tri1.append('line')
        .attr('x1', margin + triangleSize)
        .attr('x2', margin + triangleSize + lengthSize)
        .attr('y1', height / 2)
        .attr('y2', height / 2)
        .style('stroke', symbolColor1)
        .style('stroke-width', 1);

    const tri2 = g.append('g');
    
    tri2.append('polygon')
        .attr('points', `${width - margin},${height / 2}` +
        ` ${width - margin - triangleSize},${height / 2 - triangleSize / 2}` +
        ` ${width - margin - triangleSize},${height / 2 + triangleSize / 2}`
        )
        .style('fill', 'steelblue')
        .style('stroke', 'none');
    
    tri2.append('line')
        .attr('x1', width - margin - triangleSize)
        .attr('x2', width - margin - triangleSize - lengthSize)
        .attr('y1', height / 2)
        .attr('y2', height / 2)
        .style('stroke', symbolColor1)
        .style('stroke-width', 1);

    function animate() {

    }

    return {
        element: g,
        animate,
    };
}

const symbolSize = 10;
const symbolColor2 = 'lightgrey';

function symbolColorDiscrete(svg, width = defaultWidth, height = defaultHeight, margin = defaultMargin) {
    const g = svg.append('g');
    g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .style('fill', backgroundColor)
        .style('stroke', 'none');

    const el1 = g.append('rect')
        .attr('x', margin)
        .attr('y', height / 2 - symbolSize / 2)
        .attr('width', symbolSize)
        .attr('height', symbolSize)
        .style('stroke', 'none')
        .style('fill', symbolColor2);

    const el2 = g.append('rect')
        .attr('x', width / 2 - symbolSize / 2)
        .attr('y', height / 2 - symbolSize / 2)
        .attr('width', symbolSize)
        .attr('height', symbolSize)
        .style('stroke', 'none')
        .style('fill', symbolColor2);

    const el3 = g.append('rect')
        .attr('x', width - margin - symbolSize)
        .attr('y', height / 2 - symbolSize / 2)
        .attr('width', symbolSize)
        .attr('height', symbolSize)
        .style('stroke', 'none')
        .style('fill', symbolColor2);

    function animate() {

    }

    return {
        element: g,
        animate,
    };
}

function symbolColorGradient(svg, width = defaultWidth, height = defaultHeight, margin = defaultMargin) {
    const g = svg.append('g');
    g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .style('fill', backgroundColor)
        .style('stroke', 'none');

    const el1 = g.append('rect')
        .attr('x', margin)
        .attr('y', height / 2 - symbolSize / 2)
        .attr('width', symbolSize)
        .attr('height', symbolSize)
        .style('stroke', 'none')
        .style('fill', symbolColor2);

    const el2 = g.append('rect')
        .attr('x', width / 2 - symbolSize / 2)
        .attr('y', height / 2 - symbolSize / 2)
        .attr('width', symbolSize)
        .attr('height', symbolSize)
        .style('stroke', 'none')
        .style('fill', symbolColor2);

    const el3 = g.append('rect')
        .attr('x', width - margin - symbolSize)
        .attr('y', height / 2 - symbolSize / 2)
        .attr('width', symbolSize)
        .attr('height', symbolSize)
        .style('stroke', 'none')
        .style('fill', symbolColor2);

    function animate() {

    }

    return {
        element: g,
        animate,
    };
}


export default {
    symbolSizeVertical,
    symbolSizeHorizontal,
    symbolColorDiscrete,
    symbolColorGradient,
};
