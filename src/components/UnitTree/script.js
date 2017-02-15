import draggable from 'vuedraggable';
import * as d3 from 'd3';
import { mapState, mapActions, mapGetters } from 'vuex';
import store, { SELECT_BLOCK, UPDATE_BLOCKS } from '../../store';

let draggingNode = null;
let selectedNode = null;
let blocks;
let nodes;
let bTree;
let click = false;

// function line(d) {
//     // return `M${d.source.y},${d.source.x
//     //    }C${(d.source.y + d.target.y) / 2},${d.source.x
//     //    } ${(d.source.y + d.target.y) / 2},${d.target.x
//     //    } ${d.target.y},${d.target.x}`;
//     return `M${d.source.y},${d.source.x}L${d.target.y},${d.target.x}`;
// }

// function connectNode() {
//     let data = [];
//     if (draggingNode != null && selectedNode != null) {
//         data = [{ source: { x: selectedNode.x, y: selectedNode.y },
//             target: { x: draggingNode.x, y: draggingNode.y } }];
//     }
//     const link = d3.select('.svgGroup').selectAll('.templink').data(data);

//     link.enter().append('path')
//           .attr('class', 'templink')
//           .attr('d', line)
//           .style('stroke', 'var(--color-0)')
//           .style('stroke-width', '2')
//           .style('fill', 'var(--color-2)')
//           .attr('pointer-events', 'none');


//     link.attr('d', line);

//     link.exit().remove();
// }

function updateTree(nodes) {
    const link = d3.select('.svgGroup')
        .selectAll('.link')
        .data(nodes.descendants().slice(1));

    link.enter().append('path')
        .attr('class', 'link')
        .style('stroke', 'var(--color-0)')
        .style('stroke-width', '2')
        .attr('d', d => `M${d.y},${d.x
            }C${(d.y + d.parent.y) / 2},${d.x
            } ${(d.y + d.parent.y) / 2},${d.parent.x
            } ${d.parent.y},${d.parent.x}`)
        .style('fill', 'var(--color-2)');

    link.attr('d', d => `M${d.y},${d.x
        }C${(d.y + d.parent.y) / 2},${d.x
        } ${(d.y + d.parent.y) / 2},${d.parent.x
        } ${d.parent.y},${d.parent.x}`);
    link.exit().remove();

    const node = d3.select('.svgGroup').selectAll('.node')
        .data(nodes.descendants());

    const nodeGroup1 = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);
    const nodeGroup2 = node.attr('transform', d => `translate(${d.y},${d.x})`);

    const nodeGroup3 = node.exit().remove();


    nodeGroup1.append('rect')
        .attr('class', 'bgrect')
        .attr('width', 100)
        .attr('height', 50)
        .attr('x', -20)
        .attr('y', -20)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('opacity', 0.0) // change this to non-zero to see the target area
        .attr('pointer-events', 'mouseover')
        .on('mouseover', overCircle)
        .on('mouseout', outCircle);

    nodeGroup1.append('rect')
        .attr('class', 'fgrect')
        .attr('width', 50)
        .attr('height', 25)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('y', '-10')
        .style('fill', 'var(--color-0)');

    nodeGroup1.append('text')
        .text(d => d.data.name)
        .attr('y', '10')
        .attr('x', '2')
        .attr('font-size', '15px');

    nodeGroup1.call(circleDragger);

    nodeGroup2.append('rect')
        .attr('class', 'bgrect')
        .attr('width', 100)
        .attr('height', 50)
        .attr('x', -20)
        .attr('y', -20)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('opacity', 0.0) // change this to non-zero to see the target area
        // .attr('pointer-events', 'mouseover')
        .on('mouseover', overCircle)
        .on('mouseout', outCircle);

    nodeGroup2.append('rect')
        .attr('class', 'fgrect')
        .attr('width', 50)
        .attr('height', 25)
        .attr('y', '-10')
        .attr('rx', 3)
        .attr('ry', 3)
        .style('fill', 'var(--color-0)');

    nodeGroup2.append('text')
        .text(d => d.data.name)
        .attr('y', '10')
        .attr('x', '2')
        .attr('font-size', '15px');

    nodeGroup2.call(circleDragger);

    nodeGroup3.append('rect')
        .attr('class', 'bgrect')
        .attr('width', 100)
        .attr('height', 50)
        .attr('x', -20)
        .attr('y', -20)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('opacity', 0.0) // change this to non-zero to see the target area
        // .attr('pointer-events', 'mouseover')
        .on('mouseover', overCircle)
        .on('mouseout', outCircle);

    nodeGroup3.append('rect')
        .attr('class', 'fgrect')
        .attr('width', 50)
        .attr('height', 25)
        .attr('y', '-10')
        .attr('rx', 3)
        .attr('ry', 3)
        .style('fill', 'var(--color-0)');

    nodeGroup3.append('text')
        .text(d => d.data.name)
        .attr('y', '10')
        .attr('x', '2')
        .attr('font-size', '15px');

    nodeGroup3.call(circleDragger);
}

const overCircle = function (d) {
    selectedNode = d;
    if (draggingNode) {
        d3.select(this)
            .attr('opacity', 0.3)
            .style('fill', 'var(--color-1)')
            .style('stroke', 'var(--color-3)')
            .style('stroke-width', '3px');
    }
};
const outCircle = function (d) {
    selectedNode = null;
    d3.select(this).attr('opacity', 0);
};


const circleDragger =
    d3.drag()
        .on('start', function (d) {
            d3.select(this).attr('pointer-events', 'none');
            draggingNode = d;
            click = true;
        })
        .on('drag', function (d) {
            click = false;
            d3.select(this).attr('transform', `translate(${d.y += d3.event.dx},${d.x += d3.event.dy})`);
            updateTree(nodes);
        })
        .on('end', function (d) {
            blocks.forEach((block) => {
                if (block.name === draggingNode.data.name && selectedNode) {
                    block.parent = [`${selectedNode.data.name}`];
                }
            });

            d3.select(this).attr('pointer-events', '');
            draggingNode = null;
            updateTree(nodes);

            if (click) {
                d3.selectAll('.fgrect').style('stroke', 'none');
                d3.select(this)
                    .select('.fgrect')
                    .style('stroke', 'var(--color-3)')
                    .style('stroke-width', '3px');

                blocks.forEach((blk) => {
                    if (blk.name === d.data.name) {
                        blk.selected = true;
                    } else blk.selected = false;
                });
            }
            // console.info('blocks');
            // console.info(store.state.blocks);
            // console.info('block tree');
            // console.info(store.getters.bTree);
        });

const myVue = {
    computed: {
        ...mapState({
            blocks: 'blocks',
        }),
        ...mapGetters({
            bTree: 'bTree',
        }),
    },
    components: {
        draggable,
    },
    methods: {
        ...mapActions({
            selectBlock: SELECT_BLOCK,
            updateBlocks: UPDATE_BLOCKS,
        }),
    },
    mounted() {
        const tree = d3.tree()
            .size([100, 200]);

        nodes = d3.hierarchy(this.bTree, d => d.children);
        nodes = tree(nodes);


        const svg = d3.select('#bTree');
        blocks = Object.keys(this.blocks).map(k => this.blocks[k]);

        svg.append('g').attr('class', 'svgGroup');
        updateTree(nodes);
        bTree = this.bTree;
    },
    watch: {
        bTree(val) {
            bTree = val;
            const tree = d3.tree()
                .size([100, 200]);
            nodes = d3.hierarchy(bTree, d => d.children);
            nodes = tree(nodes);
            updateTree(nodes);
            // console.info(nodes);
            // console.info(store.getters.sortedBlocks);
            this.updateBlocks(blocks);
        },
    },
};

export default myVue;
