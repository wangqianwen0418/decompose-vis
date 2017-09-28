import * as d3 from 'd3';
import { mapActions, mapGetters } from 'vuex';
import { EDIT_ELE, EDIT_EXP } from '../../store';
import { shapeTransition, annoTransition, stopTransition } from "../../algorithm/animation.js";
import { opinionseer } from "../../algorithm/opinionseer.js";
import { offset } from "../../utils/common-utils.js";

export default {
    mounted() {
        var figureContent = document.getElementsByClassName('editor-view')[0];
        this.width = figureContent.clientWidth;
        this.height = figureContent.clientHeight;
        this.svg = d3.select(".editor-svg")
            .attr("width", figureContent.clientWidth)
            .attr("height", figureContent.clientHeight);

        opinionseer(d3.select(".editor-svg"),
            figureContent.clientWidth,
            figureContent.clientHeight);
    },
    data() {
        return {
            animation: '',
            editing: false,
            selectedText: null,
            width: null,
            height: null,
            svg: null,
            refreshIntervalId: null,
        };
    },
    computed: {
        message: {
            get() {
                return this.selectedText ? this.selectedText.text : '';
            },
            set(value) {
                this.selectedText.text = value;
                const svg = d3.select(this.$el).select('svg');
                svg.select('#description').text(value);
            },
        },
        ...mapGetters({
            selectedAnimation: 'selectedAnimation',
            selectedBlock: 'selectedBlock',
        }),
        styleObject() {
            const offsets = document.getElementById('positionTag').getBoundingClientRect();
            const top = offsets.top;
            const left = offsets.left;
            return {
                position: 'absolute',
                left: `${this.selectedText.x + left + 10}px`,
                top: `${this.selectedText.y + 20}px`,
            };
        },
    },
    methods: {
        exit() {
            this.editing = false;
            this.$store.commit('EDIT_ELE', this.selectedText);
        },
        selectAnnotation(val) {
            const svg = d3.select(this.$el).select('svg');

            if (!val.annotation) {
                val.annotation = {
                    text: 'Add text here',
                    x: 70,
                    y: 100,
                };
            }
            this.selectedText = val.annotation;
            this.$store.commit('EDIT_ELE', val.annotation);

            const self = this;
            const g = svg.append('g')
                .attr('class', 'annotation')
                .style('opacity', 0)
                .on('click', function () {
                    val.annotation.selected = !val.annotation.selected;
                    const group = d3.select(this);
                    if (val.annotation.selected) {
                        self.editing = true;
                    } else {
                        self.editing = false;
                    }
                });

            g.attr('text-anchor', 'start')
                .append('text')
                .attr('transform', `translate(${val.annotation.x},${val.annotation.y})`)
                .attr('id', 'description')
                .attr('font-family', 'Source Sans Pro')
                .attr('font-size', 24)
                .style('fill', 'var(--color-blue-dark)')
                .text(val.annotation.text)
                .call(d3.drag()
                    .on('drag', function (d) {
                        val.annotation.x += d3.event.dx;
                        val.annotation.y += d3.event.dy;
                        self.$store.commit('EDIT_ELE', val.annotation);
                        d3.select(this).attr('transform', `translate(${val.annotation.x},${val.annotation.y})`);
                    })
                );
            
        },
    },
    watch: {
        selectedBlock(val) {
            stopTransition();
            this.svg.selectAll('*').remove();
            if (this.selectedAnimation != null) {
                this.selectedAnimation.selected = false;
            }
        },

        selectedAnimation(val) {
            const svg = d3.select(this.$el).select('svg');
            const width = this.$el.getElementsByTagName('svg')[0].clientWidth;
            const height = this.$el.getElementsByTagName('svg')[0].clientHeight;
            svg.attr('width', width).attr('height', height);

            if (val) {
                svg.selectAll('*').remove();
                if (val.name === "anno") {
                    opinionseer(svg, width, height, val.status);
                    this.selectAnnotation(val);
                    annoTransition(this.svg);
                } else {
                    opinionseer(svg, width, height, val.status);
                    this.selectedText = null;
                    shapeTransition(val.status, val.nextStatus, val.name, this.svg);
                }
            }
        }
    },
};
