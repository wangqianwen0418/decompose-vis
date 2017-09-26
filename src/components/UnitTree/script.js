import draggable from 'vuedraggable';
import * as d3 from 'd3';
import {
    mapState,
    mapActions,
    mapGetters
} from 'vuex';
import {
    SELECT_BLOCK,
    UPDATE_BLOCKS
} from '../../store';
import {
    opinionseer
} from "../../algorithm/opinionseer.js";

let draggingNode = null;
let selectedNode = null;
let blocks;
let nodes;
let bTree;
let click = false;

function line(d) {
    return `M${d.y},${d.x
        } L${d.parent.y},${d.parent.x}`;
}

function updateTree(nodes) {
    const x = [70, 70, 70, 200, 200, 200];
    const y = [50, 200, 350, 50, 200, 350];

    //    const x = [150, 50, 50, 230, 230, 170];
    //    const y = [150, 50, 250, 50, 200, 330];

    nodes.descendants().forEach((d, i) => {
        d.x = x[i];
        d.y = y[i];
    })

    d3.selectAll('.svgGroup.link').remove();
    d3.selectAll('.svgGroup.node').remove();

    const link = d3.select('.svgGroup')
        .selectAll('.link')
        .data(nodes.descendants().slice(1))
        .enter().append("g").style('opacity', 0);

    const node = d3.select('.svgGroup').selectAll('.node')
        .data(nodes.descendants());

    const nodeGroup1 = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);

    nodeGroup1.append('circle')
        .attr('class', 'label')
        .attr('transform', 'translate(80, -20)')
        .attr('r', 10)
        .style('stroke', 'var(--color-blue-light)')
        .style('stroke-width', 1)
        .style('fill', 'white');

    nodeGroup1.append('text')
        .text((d, i) => i + 1)
        .attr('transform', 'translate(80, -20)')
        .attr('dx', -3)
        .attr('dy', 4)
        .style('fill', 'var(--color-blue-light)');

    nodeGroup1.append('rect')
        .attr('class', 'fgrect')
        .attr('transform', 'translate(-12, 0)')
        .attr('width', 100)
        .attr('height', 60)
        .attr('x', -20)
        .attr('y', -30)
        .attr('rx', 3)
        .attr('ry', 3)
        .style('stroke', 'var(--color-blue-light)')
        .style('stroke-width', 2)
        .style('fill', 'white');

    nodeGroup1.append('text')
        .text(d => d.data.name)
        .attr('transform', 'translate(-12, 0)')
        .attr('dy', '10')
        .attr('x', '30')
        .attr('text-anchor', 'middle')
        .attr('font-size', '30px')
        .style('fill', 'var(--color-blue-light)')
        .style('opacity', 0.9);

    nodeGroup1.append('g')
        .attr('class', 'thumb')
        .attr('transform', 'translate(-30, -30)')
        .style('opacity', function (d, i) {
            opinionseer(d3.select(this), 100, 60, i);
        });

    nodeGroup1.call(circleDragger);

    link.append('path')
        .attr('class', 'link')
        .attr('transform', 'translate(2, 0)')
        .style('stroke', 'var(--color-blue-light)')
        .style('stroke-width', '2')
        .attr('d', d => line(d))
        .style('fill', 'none')
        .style('stroke-width', 1.5)
        .style('z-index', '-2');

    link.append('path')
        .attr('class', 'link')
        .attr('transform', 'translate(-2, 0)')
        .style('stroke', 'var(--color-blue-light)')
        .style('stroke-width', '2')
        .attr('d', d => line(d))
        .style('fill', 'none')
        .style('stroke-width', 1.5)
        .style('z-index', '-2');

    link.attr('d', d => line(d))
        .style('z-index', '-2');
}

const overCircle = function (d) {
    selectedNode = d;
    if (draggingNode) {
        d3.select(this)
            .attr('opacity', 0.3)
            .style('fill', 'var(--color-1)')
            .style('stroke', 'var(--color-blue-light)')
            .style('stroke-width', '3px');
    }
};
const outCircle = function (d) {
    selectedNode = null;
    d3.select(this)
        .attr('opacity', 0);
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
            if (selectedNode) {
                blocks.forEach((block) => {
                    if (block.name === draggingNode.data.name) {
                        block.parent = [`${selectedNode.data.name}`];
                    }

                    if (block.name === selectedNode.data.name && draggingNode.data.parent[0] === 'a vis') {
                        block.parent = ['a vis'];
                    }
                });
            }

            d3.select(this).attr('pointer-events', '');
            draggingNode = null;

            updateTree(nodes);
            if (click && d.data.name !== 'a vis') {
                d3.selectAll('.fgrect')
                    .style('stroke', 'var(--color-blue-light)')
                    .style('stroke-width', 2)

                d3.select(this)
                    .select('.fgrect')
                    .style('stroke', 'var(--color-blue-highlight)')
                    .style('stroke-width', '4');

                blocks.forEach((blk) => {
                    if (blk.name === d.data.name) {
                        blk.selected = true;
                    } else blk.selected = false;
                });
            }
        });

const myVue = {
    data() {
        return {
            status: 'ordered',
        };
    },
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
        this.width = document.getElementsByClassName('unitTree')[0].clientWidth;
        this.height = document.getElementsByClassName('unitTree')[0].clientHeight * 0.9;
        const tree = d3.tree()
            .size([this.height, this.width * 0.7]);
        nodes = d3.hierarchy(this.bTree, d => d.children);
        nodes = tree(nodes);

        const svg = d3.select('#bTree')
            .attr("height", this.height)
            .attr("width", this.width);

        blocks = this.blocks;
        svg.append('g').attr('class', 'svgGroup');
        updateTree(nodes);
        bTree = this.bTree;
    },
    watch: {
        bTree(val) {
            bTree = val;
            const tree = d3.tree()
                .size([(this.height), this.width * 0.7]);
            nodes = d3.hierarchy(bTree, d => d.children);
            nodes = tree(nodes);
            updateTree(nodes);
            this.updateBlocks(blocks);
        },
    },
};

export default myVue;
