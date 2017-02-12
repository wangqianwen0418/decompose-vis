import * as d3 from 'd3';
import { mapActions, mapGetters } from 'vuex';
import { EDIT_ITEM } from '../../store';

export default {
    computed: {
        message: {
            get() {
                const selectedEle = this.$store.getters.selectedEle;
                if (selectedEle) { return selectedEle.description.text; }
                return '';
            },
            set(value) {
                this.$store.commit('EDIT_ITEM', value);
            },
        },
        ...mapGetters({
            selectedItem: 'selectedItem',
            selectedEle: 'selectedEle',
        }),
        currentText() {
            if (this.selectedEle) { return this.selectedEle.description.text; }
            return '';
        },
    },
    methods: {
        exit() {
            this.selectedEle.selected = false;
        },
        dragstart(event) {
            this.ix = event.clientX;
            this.iy = event.clientY;
            this.left = parseInt(event.target.style.left, 10);
            this.top = parseInt(event.target.style.top, 10);
        },
        drag(event) {
            if (event.clientX !== 0) {
                event.target.style.left = `${(this.left + event.clientX) - this.ix}px`;
                event.target.style.top = `${(this.top + event.clientY) - this.iy}px`;
            }
        },
        ...mapActions({
            editItem: EDIT_ITEM,
        }),
    },
    watch: {
        currentText(val) {
            if (this.selectedEle) {
                d3.select('.current')
                    .select('text')
                    .text(val);
            }
        },
        selectedItem(val) {
            // console.info(val.attachedEles);
            const svg = d3.select('#svgEditor');

            svg.selectAll('*')
            .remove();

            const g = svg.selectAll('circle')
            .data(val.attachedEles)
            .enter()
            .append('g')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .on('click', function (d) {
                d.selected = !d.selected;
                const group = d3.select(this);
                if (d.selected) {
                    group.classed('current', true);
                    group.selectAll('path')
                  .style('stroke', 'yellow')
                  .style('stroke-width', '2');
                    group.selectAll('text').style('fill', 'yellow');
                } else {
                    group.classed('current', false);
                    group.selectAll('path')
                    .style('stroke', 'none');
                    group.select('text')
                    .style('fill', 'black');
                }
            })
            .call(d3.drag()
                    // .on('start', function () {
                    //     // console.info('drag start');
                    //     d3.selectAll(this).style('fill', 'yellow');
                    // })
                    .on('drag', function (d) {
                        // console.info('draging');
                        d3.select(this).attr('transform', `translate(${d3.event.x},${d3.event.y})`);
                        d.x = d3.event.x;
                        d.y = d3.event.y;
                    }),
                    // .on('end', function () {
                    //     // console.info('drag end');
                    //     d3.selectAll(this).style('fill', 'white');
                    // })
                    );

            const path = d3.arc()
                        .innerRadius(10)
                        .outerRadius(24)
                        .startAngle(0)
                        .endAngle(7);

            g.append('path')
                // .attr('d', d => d.path)
                .attr('d', path)
            .style('fill', 'black')
            .on('mouseover', function (d) {
                d3.select(this)
                .style('stroke', 'yellow')
                .style('stroke-width', '2px');
            })
            .on('mouseout', function (d) {
                d3.select(this)
                .style('stroke', 'none');
            });

            g.attr('text-anchor', 'start')
            .append('text')
            .attr('transform', d => `translate(${d.description.dx},${d.description.dy})`)
            .attr('class', 'description')
            .text(d => d.description.text)
            .on('mouseover', function (d) {
                d3.select(this)
                .style('fill', 'yellow');
            })
            .on('mouseout', function (d) {
                d3.select(this)
                .style('fill', 'black');
            })
            .call(d3.drag()
            .on('drag', function (d) {
                d3.select(this).attr('transform', `translate(${d3.event.x - d.x},${d3.event.y - d.y})`);
                d.description.dx = d3.event.x - d.x;
                d.description.dy = d3.event.y - d.y;
            }));
            // .call(d3.drag()
            //     .on('drag'), function (d) {
            //         console.info(this);
            //         // d3.select(this).attr('transform', `translate(${d3.event.x},${d3.event.y})`);
            //         // d.description.dx = d3.event.x - d.x;
            //         // d.description.dy = d3.event.y - d.y;
            // });
        },
    },
};

