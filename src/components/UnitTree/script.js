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
            processed: false,
            svg: null,
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
            var x = this.isSeriesView ? [50, 200, 350, 50, 200, 350] : [230, 233, 433, 40, 379, 140];
            var y = this.isSeriesView ? [70, 70, 70, 200, 200, 200] : [180, 70, 120, 170, 268, 290];
            var r = [0.69, 0.64, 0.8, 0.61, 0.69, 0.7, 0.81, 0.65, 0.7, 0.7];
            var self = this;
            var last = -1;
            nodes = nodes.descendants();
            nodes.forEach((d, i) => {
                d.background = i;
            });
            
            if (this.isSeriesView) {
                nodes = nodes.slice(1);
            }

            nodes.forEach((d, i) => {
                d.x = x[i];
                d.y = y[i];
            });

            if (!this.isSeriesView && links.length == 0) {
                links = nodes.slice(1).map(d => ({
                    x1: d.x,
                    y1: d.y,
                    x2: d.parent.x,
                    y2: d.parent.y,
                }));
                links.forEach((l, i) => l.r = r[i]);
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
                .style('opacity', this.processed ? 1 : 0);
                
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
                .style('stroke', 'var(--color-blue-light)')
                .style('stroke-width', 2)
                .style('fill', 'white');
        
            nodeRect.append('text')
                .text(d => d.data.name)
                .attr('dx', '30')
                .attr('dy', '10')
                .attr('text-anchor', 'middle')
                .attr('font-size', '30px')
                .style('fill', 'var(--color-blue-light)')
                .style('opacity', 0.9);
        
            node.append('g')
                .attr('class', 'thumb')
                .attr('transform', 'translate(-30, -30)')
                .style('opacity', function (d) {
                    opinionseer(d3.select(this), 100, 60, d.background);
                });
        
            node.on("click", function(d, i){
                if (d.data.name !== 'a vis') {
                    if (d3.event.altKey) {
                        if (last == 1 && i == 2) {
                            links.push({
                                x1: x[1],
                                y1: y[1],
                                x2: x[2],
                                y2: y[2],
                                r: 0.81,
                            });
                        } else if (last == 1 && i == 3) {
                            links.push({
                                x1: x[1],
                                y1: y[1],
                                x2: x[3],
                                y2: y[3],
                                r: 0.65,
                            });
                        } else if (last == 3 && i == 5) {
                            links.push({
                                x1: x[3],
                                y1: y[3],
                                x2: x[5],
                                y2: y[5],
                                r: 0.7,
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
                            .attr('x2', d => (d.x2 - d.x1) * d.r + d.x1)
                            .attr('y2', d => (d.y2 - d.y1) * d.r + d.y1)
                            .style('fill', 'none')
                            .style('stroke-width', 1.5)
                            .attr("marker-end", "url(#arrow)");
                    } else {
                        d3.selectAll('.fgrect')
                            .style('stroke', 'var(--color-blue-light)')
                            .style('stroke-width', 2)
                        d3.select(this)
                            .select('.fgrect')
                            .style('stroke', 'var(--color-blue-highlight)')
                            .style('stroke-width', '4');
                        last = i;
                    }

                    if (self.isSeriesView) {
                        blocks.forEach((blk) => {
                            if (blk.name === d.data.name) {
                                blk.selected = true;
                            } else blk.selected = false;
                        });
                    } else {

                    }
                }
            });
        
            link.append('line')
                .style('stroke', 'var(--color-blue-light)')
                .style('stroke-width', '2')
                .attr('x1', d => d.x1)
                .attr('y1', d => d.y1)
                .attr('x2', d => (d.x2 - d.x1) * d.r + d.x1)
                .attr('y2', d => (d.y2 - d.y1) * d.r + d.y1)
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
