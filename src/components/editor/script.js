import * as d3 from 'd3';
import { mapActions, mapGetters } from 'vuex';
import { EDIT_ELE } from '../../store';
import SymbolButton from '../Symbol';
import { offset } from "../../utils/common-utils.js";

export default {
    data() {
        return {
            animation: '',
            editing: false,
            selectedText: null,
        };
    },
    components: {
        SymbolButton,
    },
    computed: {
        message: {
            get() {
                return this.selectedText ? this.selectedText.text : '';
            },
            set(value) {
                this.selectedText.text = value;
                this.$store.commit('EDIT_ELE', value);
                d3.select('.current')
                    .select('#description')
                    .text(value);
            },
        },
        ...mapGetters({
            selectedChannel: 'selectedChannel',
        }),
        currentText() {
            if (this.selectedText) {
                return this.selectedText.text;
            }
            return '';
        },
        styleObject() {
            const offsets = document.getElementById('positionTag').getBoundingClientRect();
            const top = offsets.top;
            const left = offsets.left;
            return {
                position: 'absolute',
                left: `${this.selectedText.x + left}px`,
                top: `${this.selectedText.y + top}px`,
            };
        },
    },
    methods: {
        exit() {
            this.editing = false;
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
        ondrop(event) {
            const id = event.dataTransfer.getData('text');
            const item = document.getElementById(id);
            const geo = item.getElementsByTagName('svg')[0].firstChild;
            const x = item.getAttribute('x');
            const y = item.getAttribute('y');
            const width = item.getAttribute('width');
            const svg = this.$el.getElementsByClassName('svgEditor')[0];
            const ratio = svg.clientWidth / width;
            d3.select(geo)
                .attr('transform', `translate(${x}, ${y}), scale(${ratio})`);
            svg.appendChild(geo);
            item.remove();
        },
        ...mapActions({
            editEle: EDIT_ELE,
        }),
        canvasClick(event) {
            const vcanvas = this.selectedChannel.parent.canvas;
            const canvas = vcanvas.canvas;
			const realWidth = canvas.parentNode.clientWidth;
			const realHeight = canvas.parentNode.clientHeight;
			const zoom_ratio = Math.max(canvas.width / realWidth, canvas.height / realHeight);
			const x = Math.floor((event.pageX - offset.x(canvas)) * zoom_ratio);
			const y = Math.floor((event.pageY - offset.y(canvas)) * zoom_ratio);
            const currentItem = vcanvas.getItem(x, y);
            console.info('click item ' + currentItem.index);
        },
		canvasMousemove(event) {
            const vcanvas = this.selectedChannel.parent.canvas;
            const canvas = vcanvas.canvas;
			const realWidth = canvas.parentNode.clientWidth;
			const realHeight = canvas.parentNode.clientHeight;
			const zoom_ratio = Math.max(canvas.width / realWidth, canvas.height / realHeight);
			const x = Math.floor((event.pageX - offset.x(canvas)) * zoom_ratio);
			const y = Math.floor((event.pageY - offset.y(canvas)) * zoom_ratio);
            const currentItem = vcanvas.getItem(x, y);
            if (currentItem) {
                vcanvas.render(this.selectedChannel.index, currentItem);
            } else {
                vcanvas.render(this.selectedChannel.index);
            }
//			console.info(x, y, event, `time used: ${(new Date()).getTime() - start_time.getTime()} ms`);
		},
        canvasMouseout(event) {
            const vcanvas = this.selectedChannel.parent.canvas;
            vcanvas.render(this.selectedChannel.index);
        }
    },
    watch: {
        selectedChannel(val) {
            if(val){
            const svg = d3.select(this.$el).select('svg');
            const svgdom = this.$el.getElementsByTagName('svg')[0];
            const width = svgdom.clientWidth;
            const height = svgdom.clientHeight;
            svg.attr('width', width)
                .attr('height', height);

            svg.selectAll('*')
                .remove();

            if (!val.annotations || val.annotations.length === 0) {
                val.annotations = ['add text'];
            }
            if (val.annotations.length > 0 && typeof val.annotations[0] === 'string') {
                val.annotations = [val.annotations.join(' ')].map((d, i) => ({
                    text: d,
                    x: 100,
                    y: 100 + i * 30,
                    dx: 0,
                    dy: 0
                }))
            }
            
            const self = this;
            if(val.annotations) {
            const g = svg.selectAll('.element')
                .data(val.annotations)
                .enter()
                .append('g')
                .attr('class', 'element')
                .attr('transform', d => {
                    return `translate(${d.x},${d.y})`;
                })
                .on('click', function (d) {
                    d.selected = !d.selected;
                    const group = d3.select(this);
                    if (d.selected) {
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
                        self.editing = true;
                        self.selectedText = d;
                    } else {
                        group.classed('current', false);

                        // group.selectAll('path')
                        // .style('stroke', 'none');

                        // group.select('text')
                        // .style('fill', 'black');

                        group.select('#editTag').remove();
                        self.editing = false;
                        self.selectedText = null;
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

            g.attr('text-anchor', 'start')
                .append('text')
                .attr('id', 'description')
                .attr('transform', d => `translate(${d.dx},${d.dy})`)
                .attr('class', 'description')
                .attr('font-family', 'Source Sans Pro')
                .attr('font-size', 20)
                .text(d => d.text)
                // .on('mouseover', function (d) {
                //     d3.select(this)
                //     .style('fill', 'yellow');
                // })
                // .on('mouseout', function (d) {
                //     d3.select(this)
                //     .style('fill', 'black');
                // })
                .call(d3.drag()
                    .on('drag', function (d) {
                        d3.select(this).attr('transform', `translate(${d3.event.x - d.x},${d3.event.y - d.y})`);
                        d.dx = d3.event.x - d.x;
                        d.dy = d3.event.y - d.y;
                    }));
            // .call(d3.drag()
            //     .on('drag'), function (d) {
            //         console.info(this);
            //         // d3.select(this).attr('transform', `translate(${d3.event.x},${d3.event.y})`);
            //         // d.description.dx = d3.event.x - d.x;
            //         // d.description.dy = d3.event.y - d.y;
            // });
            }
            }
        },
    },
};
