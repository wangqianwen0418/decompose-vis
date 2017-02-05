import * as d3 from 'd3';
import { mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';
import { REMOVE_ITEM, SELECT_ITEM } from '../../store';


// {'b':2, 'a':1}
export default {
    props: ['item', 'index'],
    data() {
        return {
            height: window.innerHeight * 0.35,
            width: window.innerWidth * 0.35,
            line: '',
        };
    },
    methods: {
        getScales() {
            const x = d3.scaleTime().range([0, this.width * 0.5]);
            const y = d3.scaleLinear().range([this.height * 0.5, 0]);
            const r = d3.scaleLinear().range([0, this.height * 0.4]);
            // d3.axisLeft().scale(x);
            // d3.axisBottom().scale(y);
            x.domain([0, d3.max(this.item.attachedEles, d => d.x)]);
            y.domain([0, d3.max(this.item.attachedEles, d => d.y)]);
            r.domain([0, d3.max(this.item.attachedEles, d => d.r)]);
            return { x, y, r };
        },
        calculatePath() {
            const svg = d3.select(this.$el.getElementsByTagName('svg')[0]);
            // const scale = this.getScales();
            const circles = this.item.attachedEles;
            svg.selectAll('circle')
            .data(circles)
            .enter()
            .append('g')
            .append('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', d => d.r)
            .style('fill', 'white')
            .call(d3.drag()
                    .on('start', function () {
                        // console.info('drag start');
                        d3.select(this).style('fill', 'yellow');
                    })
                    .on('drag', function (d) {
                        // console.info('draging');
                        d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
                    })
                    .on('end', function () {
                        // console.info('drag end');
                        d3.select(this).style('fill', 'white');
                    }),
                    );
        },
        ...mapActions({
            removeItem: REMOVE_ITEM,
            selectItem: SELECT_ITEM,
        }),
    },
    computed: {
        styleObject() {
            if (this.item.selected) {
                return {
                    border: '5px solid #1499CC',
                };
            }
            return null;
        },
        ...mapState({
            attachedEles: (state) => {
                const selectedItem = state.items.filter(item => item.selected)[0];
                return selectedItem.attachedEles;
            },
        }),
    },
    mounted() {
        this.calculatePath();
    },
    components: {
        draggable,
    },
};