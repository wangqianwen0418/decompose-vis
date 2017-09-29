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

let selectedNode = null;
let blocks;
let nodes;
let bTree;
var links = [];

function line(d) {
    return `M${d.x},${d.y} L${d.parent.x},${d.parent.y}`;
}

const myVue = {
    data() {
        return {
            isSeriesView: false,
            processed: true,
            svg: null,
        };
    },
    computed: {
        ...mapState({
            blocks: 'blocks',
        }),
        ...mapGetters({
            bTree: 'bTree',
            selectedBlock: 'selectedBlock',
        }),
    },
    methods: {
        ...mapActions({
            selectBlock: SELECT_BLOCK,
            updateBlocks: UPDATE_BLOCKS,
        }),
        changeView() {
            if (!this.processed) {
                this.processed = true;
                this.svg.selectAll(".nodelabel")
                    .transition()
                    .delay((d, i) => i * 1000)
                    .duration(500)
                    .style("opacity", 1);
            } else {
                this.isSeriesView = !this.isSeriesView;
                const tree = d3.tree()
                    .size([(this.height), this.width * 0.7]);
                nodes = d3.hierarchy(bTree, d => d.children);
                nodes = tree(nodes);
                this.updateTree(nodes);
                this.updateBlocks(blocks);
            }
        },
        updateTree(nodes) {
            var x = this.isSeriesView ? [0, 50, 200, 350, 50, 200, 350] : [280, 283, 483, 90, 429, 190];
            var y = this.isSeriesView ? [0, 70, 70, 70, 200, 200, 200] : [180, 70, 120, 170, 268, 290];
            var ratio = [
                [0.7, 0.81, 0.66, 0.82, 0.83],
                [0.7, 0.7, 0.81, 0.74, 0.79],
                [0.7, 0.7, 0.7, 0.9, 0.7],
                [0.7, 0.7, 0.7, 0.7, 0.7],
            ];
            var self = this;
            var last = -1;

            nodes = nodes.descendants();
            nodes.forEach((d, i) => {
                d.x = x[i];
                d.y = y[i];
                d.index = i;
            });
            nodes = nodes.slice(1);

            if (!this.isSeriesView && links.length == 0) {
            }
        
            this.svg.selectAll('.svgGroup').remove();
            const svgGroup = this.svg.append('g')
                .attr('class', 'svgGroup')
                .attr('transform', `scale(${this.height < 360 && !this.isSeriesView? this.height / 360 : 1})`);

            const linkGroup = svgGroup.append("g")
                .attr("class", "linkGroup")
                //.attr("transform", "translate(60, -30)");

            var defs = svgGroup.append("defs");
            var arrowMarker = defs.append("marker")
                .attr("id", "arrow")
                .attr("markerUnits", "strokeWidth")
                .attr("markerWidth", "12")
                .attr("markerHeight", "12")
                .attr("viewBox", "0 0 12 12") 
                .attr("refX", "6")
                .attr("refY", "6")
                .attr("orient", "auto");
            var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
            arrowMarker.append("path")
                .attr("d", arrow_path)
                .attr("fill", 'var(--color-blue-light)');    

            var link = linkGroup
                .selectAll('.link')
                .data(links)
                .enter().append("g")
                .attr("class", "link")
                .style("opacity", 0)
                .style("display", this.isSeriesView ? "none" : "block");

            const node = svgGroup.selectAll('.node')
                .data(nodes).enter().append('g')
                .attr('class', 'node')
                .attr('transform', d => `translate(${d.x},${d.y})`)
                .style('opacity', 0);

            link.transition().duration(500).style("opacity", 1);
            node.transition().duration(500).style("opacity", 1);
            
            const nodeLabel = node.append('g')
                .attr('transform', 'translate(80, -20)')
                .attr('class', 'nodelabel')
                .style('opacity', this.isSeriesView ? 1 : 0);
                
            nodeLabel.append('circle')
                .attr('class', 'label')
                .attr('r', 10)
                .style('stroke', 'var(--color-blue-light)')
                .style('stroke-width', 1)
                .style('fill', 'white');
        
            nodeLabel.append('text')
                .text((d, i) => i + 1)
                .attr('dx', -3)
                .attr('dy', 4)
                .style('fill', 'var(--color-blue-light)');
        
            const nodeRect = node.append('g')
                .attr('transform', 'translate(-12, 0)');
        
            nodeRect.append('rect')
                .attr('class', 'fgrect')
                .attr('width', 100)
                .attr('height', 60)
                .attr('x', -20)
                .attr('y', -30)
                .attr('rx', 3)
                .attr('ry', 3)
                .style('stroke', (d) => {
                    if (this.selectedBlock) {
                        return d.data.name == this.selectedBlock.name ? 
                        'var(--color-blue-highlight)':
                        'var(--color-blue-light)';
                    } else {
                        return 'var(--color-blue-light)';
                    }
                })
                .style('stroke-width', (d) => {
                    if (this.selectedBlock) {
                        return d.data.name == this.selectedBlock.name ? 4 : 2
                    } else {
                        return 2;
                    }
                })
                .style('fill', 'white');
        
            nodeRect.append('text')
                .text(d => d.data.name)
                .attr('dx', '50')
                .attr('dy', '50')
                .attr('text-anchor', 'middle')
                .attr('font-size', '20px')
                .style('fill', 'var(--color-blue-light)')
                .style('opacity', 0.9);
        
            node.append('g')
                .attr('class', 'thumb')
                .attr('transform', 'translate(-30, -30)')
                .style('opacity', function (d) {
                    opinionseer(d3.select(this), 100, 60, d.index);
                });
        
            node.on("click", function(d, i){
                if (d.data.name !== 'a vis') {
                    if (d3.event.altKey) {
                        if (last != -1 && last < i) {
                            links.push({
                                x1: nodes[last].x,
                                y1: nodes[last].y,
                                x2: nodes[i].x,
                                y2: nodes[i].y,
                                ratio: ratio[last][i],
                            });
                        }
                        link = linkGroup
                            .selectAll('.link')
                            .data(links)
                            .enter().append("g")
                            .attr("class", "link");

                        link.append('line')
                            .style('stroke', 'var(--color-blue-light)')
                            .style('stroke-width', '2')
                            .attr('x1', d => d.x1)
                            .attr('y1', d => d.y1)
                            .attr('x2', d => (d.x2 - d.x1) * d.ratio + d.x1)
                            .attr('y2', d => (d.y2 - d.y1) * d.ratio + d.y1)
                            .style('fill', 'none')
                            .style('stroke-width', 1.5)
                            .attr("marker-end", "url(#arrow)");
                    } else {
                        last = i;
                    }

                    if (self.isSeriesView) {
                        blocks.forEach((blk) => {
                            if (blk.name === d.data.name) {
                                blk.selected = true;
                            } else blk.selected = false;
                        });
                    } else {
                        nodeRect
                        .select("rect")
                        .style('stroke', (d, k) => (last == k) ? 
                                'var(--color-blue-highlight)':
                                'var(--color-blue-light)'
                        )
                        .style('stroke-width',  (d, k) => (last == k) ? 4 : 2);
                    }
                }
            });
        
            link.append('line')
                .style('stroke', 'var(--color-blue-light)')
                .style('stroke-width', '2')
                .attr('x1', d => d.x1)
                .attr('y1', d => d.y1)
                .attr('x2', d => (d.x2 - d.x1) * d.ratio + d.x1)
                .attr('y2', d => (d.y2 - d.y1) * d.ratio + d.y1)
                .style('fill', 'none')
                .style('stroke-width', 1.5)
                .attr("marker-end", "url(#arrow)");
        },
    },
    mounted() {
        this.width = document.getElementsByClassName('unitTree')[0].clientWidth;
        this.height = document.getElementsByClassName('unitTree')[0].clientHeight * 0.9;
        const tree = d3.tree()
            .size([this.height, this.width * 0.7]);
        nodes = d3.hierarchy(this.bTree, d => d.children);
        nodes = tree(nodes);

        this.svg = d3.select('#bTree')
            .attr("height", this.height)
            .attr("width", this.width);

        blocks = this.blocks;
        this.updateTree(nodes);
        bTree = this.bTree;
    },
    watch: {
        bTree(val) {
            bTree = val;
            const tree = d3.tree()
                .size([(this.height), this.width * 0.7]);
            nodes = d3.hierarchy(bTree, d => d.children);
            nodes = tree(nodes);
            this.updateTree(nodes);
            this.updateBlocks(blocks);
        },
    },
};

export default myVue;
