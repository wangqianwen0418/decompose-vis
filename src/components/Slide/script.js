import { mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';
import { REMOVE_ITEM, SELECT_ITEM } from '../../store';
import * as d3 from 'd3';

console.info(document.getElementById('slideText'));
// {'b':2, 'a':1}
export default {
    props: ['item', 'mark', 'block'],
    data() {
        return {
            height: window.innerHeight * 0.4,
            width: window.innerWidth * 0.35,
            line: '',
        };
    },
    methods: {
        // ondrop(event) {
        //   const id = event.dataTransfer.getData('text');
        //   const item = document.getElementById(id);
        //   const geo = item.getElementsByTagName('svg')[0].firstChild;
        //   const x = item.getAttribute('x');
        //   const y = item.getAttribute('y');
        //   const width = item.getAttribute('width');
        //   const svg = this.$el.getElementsByClassName('svg-stage')[0];
        //         console.log(svg);
        //         const svgWidth = d3.select(svg).attr('width');
        //   const ratio = svgWidth / width;
        //         console.log(ratio, svgWidth, width);
        //   d3.select(geo)
        //     .attr('transform', `translate(${x}, ${y}), scale(${ratio})`);
        //   svg.appendChild(geo);
        //   item.remove();
        // },
        // getScales() {
        //     const x = d3.scaleTime().range([0, this.width * 0.5]);
        //     const y = d3.scaleLinear().range([this.height * 0.5, 0]);
        //     const r = d3.scaleLinear().range([0, this.height * 0.4]);
        //     // d3.axisLeft().scale(x);
        //     // d3.axisBottom().scale(y);
        //     x.domain([0, d3.max(this.item.attachedEles, d => d.x)]);
        //     y.domain([0, d3.max(this.item.attachedEles, d => d.y)]);
        //     r.domain([0, d3.max(this.item.attachedEles, d => d.r)]);
        //     return { x, y, r };
        // },
        // calculatePath() {
        //     const svg = d3.select(this.$el.getElementsByTagName('svg')[0]);
        //     // const scale = this.getScales();
        //     const circles = this.item.attachedEles;
        //     svg.selectAll('circle')
        //     .data(circles)
        //     .enter()
        //     .append('g')
        //     .append('circle')
        //         .attr('cx', d => d.x)
        //         .attr('cy', d => d.y)
        //         .attr('r', d => d.r)
        //     .style('fill', 'white')
        //     .call(d3.drag()
        //             .on('start', function () {
        //                 // console.info('drag start');
        //                 d3.select(this).style('fill', 'yellow');
        //             })
        //             .on('drag', function (d) {
        //                 // console.info('draging');
        //                 d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
        //             })
        //             .on('end', function () {
        //                 // console.info('drag end');
        //                 d3.select(this).style('fill', 'white');
        //             }),
        //             );
        // },
        ...mapActions({
            removeItem: REMOVE_ITEM,
            selectItem: SELECT_ITEM,
        }),
    },
    computed: {
        styleObject() {
            if (this.item.selected) {
                return {
                    border: '0.5vh dashed #417378',
                    height: '19vh',
                    width: '19vw',
                };
            }
            return null;
        },
        ...mapState({
            selectedEle: 'selectedEle',
        }),
    },
    // mounted() {
    //     this.calculatePath();
    // },
    components: {
        draggable,
    },
};
