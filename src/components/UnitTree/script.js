import draggable from 'vuedraggable';
import * as d3 from 'd3';
import { mapState, mapActions, mapGetters } from 'vuex';
import { SELECT_BLOCK } from '../../store';

export default {
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
        }),
    },
    mounted() {
        const tree = d3.tree()
                .size([100, 200]);

        let nodes = d3.hierarchy(this.bTree[0], d => d.children);
        nodes = tree(nodes);

        const svg = d3.select('#bTree').append('svg');
        // .attr('width', 100)
        // .attr('height', 50);

        const g = svg.append('g');

        const link = g.selectAll('.link')
                    .data(nodes.descendants().slice(1))
                    .enter().append('path')
                    .attr('class', 'link')
                    .style('stroke', 'var(--color-0)')
                    .style('stroke-width', '2')
                    .attr('d', d => `M${d.y},${d.x
                        }C${(d.y + d.parent.y) / 2},${d.x
                        } ${(d.y + d.parent.y) / 2},${d.parent.x
                        } ${d.parent.y},${d.parent.x}`)
                    .style('fill', 'var(--color-2)');
        const node = g.selectAll('.node')
                        .data(nodes.descendants())
                    .enter().append('g')
                        .attr('class', d => `node${
                            d.children ? ' node--internal' : ' node--leaf'}`)
                        .attr('transform', d => `translate(${d.y},${d.x})`);

        node.append('rect')
            .attr('width', 50)
            .attr('height', 25)
            .attr('y', '-10')
            .style('fill', 'var(--color-0)');

        node.append('text')
        .text(d => d.data.name)
        .attr('y', '10')
        .attr('x', '2')
        .attr('font-size', '15px');

        node.call(d3.drag()
        .on('start', () => {
            console.info('start drag');
        })
        .on('drag', function (d) {
            d3.select(this).attr('transform', `translate(${d3.event.x},${d3.event.y})`);
            d.y = d3.event.x;
            d.x = d3.event.y;
        })
        .on('end', (d) => {

        }),
        );

        // console.info(nodes);
    },
};
