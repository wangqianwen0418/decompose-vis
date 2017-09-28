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
                svg.select('.description').text(value);
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
            this.selectedText = val.annotation;
            this.$store.commit('EDIT_ELE', val.annotation);            
        },
    },
    watch: {
        selectedBlock(val) {
            stopTransition();
            this.svg.selectAll('*').remove();
            this.editing = false;
            if (this.selectedAnimation != null) {
                this.selectedAnimation.selected = false;
            }
        },

        selectedAnimation(val) {
            const svg = d3.select(this.$el).select('svg');
            const width = this.$el.getElementsByTagName('svg')[0].clientWidth;
            const height = this.$el.getElementsByTagName('svg')[0].clientHeight;
            svg.attr('width', width).attr('height', height);
            this.editing = false;

            if (val) {
                svg.selectAll('*').remove();
                if (val.name === "anno") {
                    opinionseer(svg, width, height, val.status);
                    this.selectAnnotation(val);
                    annoTransition(val, this.svg);
                    const anno = this.svg.select(".annotation").select("text");

                    setTimeout(() => {
                        this.editing = true;
                        anno.call(d3.drag()
                            .on('drag',(d) => {
                                val.annotation.x += d3.event.dx;
                                val.annotation.y += d3.event.dy;
                                this.$store.commit('EDIT_ELE', val.annotation);
                                anno.attr('transform', `translate(${val.annotation.x},${val.annotation.y})`);
                            })
                        );
                    }, 500);
                } else {
                    opinionseer(svg, width, height, val.status);
                    this.selectedText = null;
                    shapeTransition(val, this.svg);
                }
            }
        }
    },
};
