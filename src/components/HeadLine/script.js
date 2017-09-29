import introJs from 'intro.js';
import * as d3 from 'd3';
import { shapeTransition, annoTransition, stopTransition } from "../../algorithm/animation.js";
import { opinionseer } from "../../algorithm/opinionseer.js";

const imgs = [
    require('assets/op1.png'),
    require('assets/op1.png'),
    require('assets/op2.png'),
    require('assets/op3.png'),
    require('assets/op4.png'),
    require('assets/op5.png'),
    require('assets/op6.png'),
    require('assets/op7.png'),
    require('assets/op8.png'),
    require('assets/op9.png'),
    require('assets/op10.png'),
];

const stepDuration = 1000;

export default {
    data() {
        return {
            options: [{
                value: '1',
                label: 'OpinionSeer',
            }, {
                value: '2',
                label: 'ParallelSets',
            }],
            showForm: false,
            showView: false,
            isPlaying: false,
            value: null,
            svg: null,
            animations: [],
            playIndex: 0,
            open: false,
            currentImage: null,
            treeData: {
                name: 'OpinionSeer',
                color: "black",
                expanded: true,
                img: imgs[0],
                children: [
                    { 
                        name: 'class-triangle',
                        color: "black",
                        img: imgs[2],
                        children: [
                            {
                                name: 'class-scatter',
                                color: "black",
                                img: imgs[4],
                                children: ["circle", "circle", "..."],
                            },
                            {
                                name: 'class-background',
                                color: "black",
                                img: imgs[9],
                            }
                        ],
                    },
                    {
                        name: 'class-bar',
                        color: "black",
                        img: imgs[10],
                    },
                    {
                        name: 'class-rings',
                        color: "black",
                        img: imgs[7],
                        children: [
                            {
                                name: 'class-ring',
                                color: "black",
                                img: imgs[5],
                            },
                            {
                                name: 'class-ring2',
                                color: "black",
                                img: imgs[6],
                            }
                        ]
                    },
                    {
                        name: 'class-sankey',
                        color: "black",
                        img: imgs[8],
                    },
                ]
            }
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
        }
    },
    methods: {
        mouseover(node) {
            this.currentImage = node.img;
        },
        treeclick(node) {
            const t = node._children;
            node._children = node.children;
            node.children = t;
        },
        treeselect(node) {
            const t = node._children;
            node._children = node.children;
            node.children = t;
            if (node.color == "red") {
                node.color = "black";
            } else {
                node.color = "red";
            }
        },
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
        importopen() {
            this.showForm = true;
            const dialogs = document.getElementsByClassName("el-dialog--middle");
            for (var i = 0; i < dialogs.length; ++i) {
                document.getElementsByClassName("el-dialog--middle")[i].style.top = "5%";
                document.getElementsByClassName("el-dialog--middle")[i].style["margin-bottom"] = 0;
            }
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
            this.playIndex = Math.max(this.playIndex - 2, 0);
            this.svg.selectAll("*").remove();
            opinionseer(this.svg, this.playerWidth, this.playerHeight, this.animations[this.playIndex].status);
            stopTransition();
        },
        onForward() {
            this.playIndex = Math.min(this.playIndex + 2, this.animations.length - 1);
            this.svg.selectAll("*").remove();
            opinionseer(this.svg, this.playerWidth, this.playerHeight, this.animations[this.playIndex].status);
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
