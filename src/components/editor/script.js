import * as d3 from 'd3';
import { mapActions, mapState, mapGetters } from 'vuex';
import { EDIT_SELECTED_ELE, SELECT_ELE } from '../../store';

export default {
    methods: {
        exit() {
            this.selectEle(null);
            d3.select('#editTag').remove();
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
            editEle: EDIT_SELECTED_ELE,
            selectEle: SELECT_ELE,
        }),
    },
    computed: {
        message: {
            get() {
                const selectedEle = this.$store.getters.selectedEle;
                const msg = selectedEle ? selectedEle.description.text : '';
                d3.select('.current #description').text(msg);
                return msg;
            },
            set(value) {
                this.selectedEle.description.text = value;
                const playload = { ...this.selectedEle, description: { text: value } };
                this.editEle(playload);
            },
        },
        ...mapState({
            selectedChannelId(state) {
                // use any attribute to trigger computed so that no need to use watch
                const selectedChannel = state.channels[state.selectedChannelId];

                const svg = d3.select('#svgEditor');

                svg.selectAll('*')
                    .remove();
                if (!selectedChannel) return null;
                const eles = selectedChannel.attachedEles.map(eid => state.eles[eid]);
                const self = this;
                // g is just a warpper, it should not be bounded with event
                const g = svg.selectAll('g.ele')
                    .data(eles)
                    .enter()
                    .append('g')
                    .attr('class', 'ele')
                    .attr('transform', d => `translate(${d.x},${d.y})`)
                    .on('click', function (d) {
                        if (d3.event.defaultPrevented) return; // dragged
                        console.log('click');
                        d.selected = !d.selected;
                        const group = d3.select(this);
                        if (d.selected) {
                            self.selectEle(d.id);
                            group.classed('current', true);

                            //     group.selectAll('#description').style('fill', 'yellow');
                            //     group.selectAll('path')
                            //   .style('stroke', 'yellow')
                            //   .style('stroke-width', '2');

                            group.append('text')
                                .attr('id', 'editTag')
                                .style('fill', 'red')
                                .attr('font-size', 14)
                                .attr('x', 0)
                                .attr('y', 0)
                                .text('editing...');
                        } else {
                            group.classed('current', false);

                            // group.selectAll('path')
                            // .style('stroke', 'none');

                            // group.select('text')
                            // .style('fill', 'black');

                            group.select('#editTag').remove();
                        }
                    })
                    .call(d3.drag()
                        .on('drag', function (d) {
                            console.info('draging');
                            d3.select(this).attr('transform', `translate(${d3.event.x},${d3.event.y})`);
                            d.x = d3.event.x;
                            d.y = d3.event.y;
                            self.editEle(d);
                        }),
                );


                const path = d3.arc()
                    .innerRadius(10)
                    .outerRadius(24)
                    .startAngle(0)
                    .endAngle(7);
                g.append('path')
                    // .attr('d', d => d.path)
                    .attr('d', path)
                    .style('fill', 'var(--color-3)');

                g.attr('text-anchor', 'start')
                    .append('text')
                    .attr('id', 'description')
                    .attr('transform', d => `translate(${d.description.dx},${d.description.dy})`)
                    .attr('class', 'description')
                    .attr('font-family', 'Source Sans Pro')
                    .attr('font-size', 20)
                    .text(d => d.description.text);

                return state.selectedChannelId;
            },
        }),
        ...mapGetters({
            selectedEle: 'selectedEle',
        }),
    },
};

