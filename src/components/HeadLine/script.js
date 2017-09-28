import introJs from 'intro.js';
import * as d3 from 'd3';
import { shapeTransition, annoTransition, stopTransition } from "../../algorithm/animation.js";
import { opinionseer } from "../../algorithm/opinionseer.js";

const stepDuration = 1000;

export default {
    data() {
        return {
            options: [{
                value: '1',
                label: 'case study 1',
            }, {
                value: '2',
                label: 'case study 2',
            }],
            showForm: false,
            showView: false,
            isPlaying: false,
            value: '',
            svg: null,
            animations: [],
            playIndex: 0,
        };
    },
    computed: {
        textDescription: {
            set(value) {
                let values = value.split('.');
                let types = ['size', 'color-h', 'color-s', 'position', 'shape'];
                types.forEach((item) => {
                    this.makeIt(item, values);
                    values = value.split('.');
                })
            },
        },
    },
    methods: {
        playing() {
            if (!this.showView || !this.isPlaying) {
                return;
            }
            if (this.playIndex >= this.animations.length) {
                this.playIndex = 0;
                stopTransition();
                return;
            }
            const ani = this.animations[this.playIndex];
            if (ani.name == "anno") {
                annoTransition(ani, this.svg);
            } else {
                shapeTransition(ani, this.svg);
            }
            setTimeout(() => {
                stopTransition();
                this.playIndex += 1;
                this.playing();
            }, ani.duration + stepDuration);
        },
        makeIt(section, value) {
            let dict = {};
            let sentences = [];
            dict['color-s'] = ['color', 'saturation'];
            dict['position'] = ['position', 'location', 'x-coordinate', 'points', 'distances'];
            dict['color-h'] = ['color', 'hue', 'shades', 'scheme'];
            dict['size'] = ['size', 'width', 'importance score', 'bigger', 'smaller'];
            dict['shape'] = ['shape', 'figure', 'glyph', 'triangle', 'square', 'icon'];
            value.forEach(function (item, index, array) {
                dict[section].forEach(function (word) {
                    if (item.includes(word)) {
                        array[index] = "<b>" + item + "</b>";
                    }
                });
            });
            //value[0] = "<textarea>" + value[0];
            //value[value.length - 1] = value[value.length - 1] + "</textarea>";
            this.$store.state.blocks.forEach(function (block) {
                block.marks.forEach(function (mark) {
                    mark.channels.forEach(function (channel) {
                        if (channel.name == section) {
                            channel.explanation = value.join(".");
                        }
                    })
                })
            })
        },
        openPlayer() {
            this.showView = true;
            const dialog = document.getElementsByClassName("el-dialog--middle")[0];
            document.getElementsByClassName("el-dialog--middle")[0].style.top = "5%";
            document.getElementsByClassName("el-dialog--middle")[0].style["margin-bottom"] = 0;
            setTimeout(() => {
                const dialog = document.getElementsByClassName("el-dialog--middle")[0];
                this.svg = d3.select("#previewCanvas");
                this.playerWidth = dialog.clientWidth * 0.77;
                this.playerHeight = dialog.clientHeight * 0.9;
                this.svg.attr("width", this.playerWidth)
                    .attr("height", this.playerHeight);
                this.animations = [];
                this.$store.state.blocks.forEach((block) => {
                    block.marks.forEach((mark) => {
                        mark.channels.forEach((channel) => {
                            channel.animations.forEach((ani) => {
                                this.animations.push(ani);
                            })
                        });
                    });
                });
                opinionseer(this.svg, this.playerWidth, this.playerHeight);
            }, 2);
        },
        onBackward() {
            this.playIndex = Math.min(this.playIndex + 2, this.animations.length - 1);
            stopTransition();
        },
        onForward() {
            this.playIndex = Math.max(this.playIndex - 2, 0);
            stopTransition();
        },
        onPlay() {
            this.isPlaying = true;
            this.playing();
        },
        onPause() {
            this.isPlaying = false;
            stopTransition();
        },
        closePlayer() {
            this.showView = false;
            this.svg.selectAll("*").remove();
            stopTransition();
        },
        save() {
            this.$notify.success({
                message: 'Your NarVis is Saved !',
                offset: 100,
            });
            this.$http.post('http://localhost:9999/save', { name: 'wqw' }).then((res) => {
                console.info(res);
            }, (err) => {
                console.info(err);
            });
        },
        intro() {
            introJs.introJs().start();
        },
        onImport() {
            setTimeout(function () {
                const canvas = document.getElementsByTagName('canvas')[0];
                this.showForm = false;
                canvas.style.display = 'block';
            }, 2000);
        },
    },
};
