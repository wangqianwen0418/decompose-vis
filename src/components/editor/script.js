import * as d3 from 'd3';
import { mapActions, mapGetters } from 'vuex';
import { EDIT_ELE } from '../../store';

export default {
    data() {
        return {
            animation: '',
        };
    },
    computed: {
        message: {
            get() {
              const selectedEle = this.$store.getters.selectedEle;
              return selectedEle ? selectedEle.description.text : '';
            },
            set(value) {
                this.$store.commit('EDIT_ELE', value);
                d3.select('.current')
                    .select('#description')
                    .text(value);
            },
        },
        ...mapGetters({
            selectedChannel: 'selectedChannel',
            selectedEle: 'selectedEle',
        }),
        currentText() {
            if (this.selectedEle) {
                return this.selectedEle.description.text;
            }
            return '';
        },
        styleObject() {
            const offsets = document.getElementById('positionTag').getBoundingClientRect();
            const top = offsets.top;
            const left = offsets.left;
            return {
                position: 'absolute',
                left: `${this.selectedEle.x + left}px`,
                top: `${this.selectedEle.y + top}px`,
            };
        },
        canvasRender(event) {
            const canvas = this.$el.getElementsByTagName('canvas')[0];
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            const data = currentData.data;
            if (this.activeBlock.name === 'overview') {
                for (let i = 0; i < width * height; ++i) {
                    data[(i << 2) + 0] = initalData.data[(i << 2) + 0];
                    data[(i << 2) + 1] = initalData.data[(i << 2) + 1];
                    data[(i << 2) + 2] = initalData.data[(i << 2) + 2];
                    data[(i << 2) + 3] = 255;
                }
                ctx.putImageData(currentData, 0, 0);
                return;
            } else {
                for (let i = 0; i < width * height; ++i) {
                    data[(i << 2) + 0] = initalData.data[(i << 2) + 0];
                    data[(i << 2) + 1] = initalData.data[(i << 2) + 1];
                    data[(i << 2) + 2] = initalData.data[(i << 2) + 2];
                    data[(i << 2) + 3] = 30;
                }
            }

            function setPixel(index, r, g, b, a) {

            }

            for (const group of groups) {
                if (this.activeBlock.selectedItems.indexOf(findGroup(group, currenttime)) != -1) {
                    const points = group.points;
                    for (let i = 0; i < points.length; i += 2) {
                        data[((points[i + 1] * width + points[i]) << 2) + 3] = 255;
                        if (points[i + 1] > 0)
                            data[((points[i + 1] * width - width + points[i]) << 2) + 3] = 255;
                        if (points[i + 1] + 1 < height)
                            data[((points[i + 1] * width + width + points[i]) << 2) + 3] = 255;
                        if (points[i] > 0)
                            data[((points[i + 1] * width + points[i] - 1) << 2) + 3] = 255;
                        if (points[i] + 1 < width)
                            data[((points[i + 1] * width + points[i] + 1) << 2) + 3] = 255;
                    }
                }
            }

            // then make it smooth
            for (let i = 0; i < height; ++i) {
                let last = -width;
                for (let j = 0; j < width; ++j) {
                    if (data[((i * width + j) << 2) + 3] === 255) {
                        if (data[((i * width + j - 1) << 2) + 3] !== 255 && j - last < 13) {
                            const g = ngroup[i * width + last];
                            if (g !== null)
                                for (let k = last + 1; k < j; ++k) {
                                    data[((i * width + k) << 2) + 0] = g.r;
                                    data[((i * width + k) << 2) + 1] = g.g;
                                    data[((i * width + k) << 2) + 2] = g.b;
                                    data[((i * width + k) << 2) + 3] = 255;
                                }
                        }
                        last = j;
                    }
                }
            }
            for (let j = 0; j < width; ++j) {
                let last = -height;
                for (let i = 0; i < height; ++i) {
                    if (data[((i * width + j) << 2) + 3] === 255) {
                        if (data[((i * width + j - width) << 2) + 3] !== 255 && i - last < 13) {
                            const g = ngroup[last * width + j];
                            if (g !== null)
                                for (let k = last + 1; k < i; ++k) {
                                    data[((k * width + j) << 2) + 0] = g.r;
                                    data[((k * width + j) << 2) + 1] = g.g;
                                    data[((k * width + j) << 2) + 2] = g.b;
                                    data[((k * width + j) << 2) + 3] = 255;
                                }
                        }
                        last = i;
                    }
                }
            }

            ctx.putImageData(currentData, 0, 0);
        },
    },
    methods: {
        exit() {
            this.selectedEle.selected = false;
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
    },
    watch: {
        selectedChannel(val) {
            // console.info(val.attachedEles);
            const svg = d3.select(this.$el).select('svg');

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
                .style('fill', 'var(--color-blue-gray)');
            // .on('mouseover', function (d) {
            //     d3.select(this)
            //     .style('stroke', 'var(--color-1)')
            //     .style('stroke-width', '2px');
            // })
            // .on('mouseout', function (d) {
            //     d3.select(this)
            //     .style('stroke', 'none');
            // });

            g.attr('text-anchor', 'start')
                .append('text')
                .attr('id', 'description')
                .attr('transform', d => `translate(${d.description.dx},${d.description.dy})`)
                .attr('class', 'description')
                .attr('font-family', 'Source Sans Pro')
                .attr('font-size', 20)
                .text(d => d.description.text)
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
