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
            }, {
                value: '3',
                label: 'ChordDiagram',
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
            if (this.value == '2') {
                parallelSetAnimation(this.svg);
                return;
            } else if (this.value == '3') {
                ChordAnimation(this.svg);
                return;
            }
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
                
                return;
                this.$store.state.blocks.forEach((block) => {
                    block.marks.forEach((mark) => {
                        mark.channels.forEach((channel) => {
                            channel.animations.forEach((ani) => {
                                this.animations.push(ani);
                            })
                        });
                    });
                });
                
                if (this.value == '1') {
                    opinionseer(this.svg, this.playerWidth, this.playerHeight);
                } 
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

const ChordDiagramSVG = `
<g transform="translate(585,396) scale(1.2) ">
<g class="group Apple">
    <g class="ticks Apple">
        <g transform="rotate(-90)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;">0%</text>
        </g>
        <g transform="rotate(-86.58334649444187)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-83.16669298888372)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-79.7500394833256)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-76.33338597776745)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-72.91673247220932)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;">5%</text>
        </g>
        <g transform="rotate(-69.50007896665117)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-66.08342546109304)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-62.666771955534905)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-59.25011844997677)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-55.83346494441863)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;">10%</text>
        </g>
        <g transform="rotate(-52.41681143886049)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-49.000157933302354)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-45.58350442774422)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-42.16685092218608)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-38.75019741662794)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;">15%</text>
        </g>
        <g transform="rotate(-35.33354391106981)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-31.916890405511666)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-28.500236899953535)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-25.08358339439539)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="1" style="opacity: 1;"></text>
        </g>
    </g>
    <text dy=".35em" class="titles" transform="rotate(-57.27119273955749)translate(292.9)" opacity="1"
        style="opacity: 1;">Apple</text>
    <path d="M1.5149860622892078e-14,-247.41600000000003A247.41600000000003,247.41600000000003 0 0,1 225.06301489977315,-102.76826543356906L216.4067450959357,-98.81563983997025A237.9,237.9 0 0,0 1.4567173675857766e-14,-237.9Z"
        style="stroke: rgb(196, 196, 196); fill: rgb(196, 196, 196); opacity: 1;"></path>
</g>
<g class="group HTC">
    <g class="ticks HTC">
        <g transform="rotate(-22.25055429859168)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;">0%</text>
        </g>
        <g transform="rotate(-18.83390079303355)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-15.41724728747542)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-12.000593781917274)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-8.583940276359144)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(-5.167286770801013)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;">5%</text>
        </g>
    </g>
    <text dy=".35em" class="titles" transform="rotate(-13.170114276869825)translate(292.9)" opacity="0"
        style="opacity: 1;">HTC</text>
    <path d="M228.99262300349832,-93.68594166670744A247.41600000000003,247.41600000000003 0 0,1 246.78599273282302,-17.645136635204555L237.29422378156056,-16.96647753385053A237.9,237.9 0 0,0 220.18521442644067,-90.08263621798791Z"
        style="stroke: rgb(105, 180, 15); fill: rgb(105, 180, 15); opacity: 1;"></path>
</g>
<g class="group Huawei">
    <g class="ticks Huawei">
        <g transform="rotate(-1.79784307462468)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;">0%</text>
        </g>
        <g transform="rotate(1.6188104309334648)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(5.03546393649161)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
    </g>
    <text dy=".35em" class="titles" transform="rotate(2.269853756417575)translate(292.9)" opacity="0"
        style="opacity: 1;">Huawei</text>
    <path d="M247.2942075267461,-7.762214871970781A247.41600000000003,247.41600000000003 0 0,1 245.9039973208161,27.31119106967117L236.44615127001546,26.260760643914587A237.9,237.9 0 0,0 237.78289185264046,-7.46366814612575Z"
        style="stroke: rgb(236, 29, 37); fill: rgb(236, 29, 37); opacity: 1;"></path>
</g>
<g class="group LG">
    <g class="ticks LG">
        <g transform="rotate(8.62938176798312)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;">0%</text>
        </g>
        <g transform="rotate(12.04603527354125)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(15.462688779099366)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(18.87934228465751)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(22.295995790215628)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
    </g>
    <text dy=".35em" class="titles" transform="rotate(16.85890423414571)translate(292.9)" opacity="0"
        style="opacity: 1;">LG</text>
    <path d="M244.61514400460015,37.122882156545096A247.41600000000003,247.41600000000003 0 0,1 224.07340523734123,104.90846544174725L215.45519734359732,100.8735244632185A237.9,237.9 0 0,0 235.20686923519244,35.69507899667798Z"
        style="stroke: rgb(200, 18, 92); fill: rgb(200, 18, 92); opacity: 1;"></path>
</g>
<g class="group Nokia">
    <g class="ticks Nokia">
        <g transform="rotate(27.38025788083158)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;">0%</text>
        </g>
        <g transform="rotate(30.796911386389738)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(34.21356489194787)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(37.630218397506)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(41.04687190306413)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(44.463525408622274)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;">5%</text>
        </g>
        <g transform="rotate(47.88017891418042)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(51.296832419738536)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(54.71348592529668)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(58.130139430854825)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(61.54679293641297)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;">10%</text>
        </g>
        <g transform="rotate(64.96344644197109)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(68.38009994752923)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(71.79675345308738)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(75.21340695864549)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(78.63006046420367)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;">15%</text>
        </g>
    </g>
    <text dy=".35em" class="titles" transform="rotate(54.52813247262014)translate(292.9)" opacity="0"
        style="opacity: 1;">Nokia</text>
    <path d="M219.6989507294829,113.78509614340652A247.41600000000003,247.41600000000003 0 0,1 35.81855235820776,244.80953486938031L34.44091572904592,235.39378352825028A237.9,237.9 0 0,0 211.24899108604123,109.40874629173703Z"
        style="stroke: rgb(0, 143, 200); fill: rgb(0, 143, 200); opacity: 1;"></path>
</g>
<g class="group Samsung">
    <g class="ticks Samsung">
        <g transform="rotate(83.96783824493201)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;">0%</text>
        </g>
        <g transform="rotate(87.38449175049013)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" opacity="0" style="opacity: 1;"></text>
        </g>
        <g transform="rotate(90.8011452560483)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(94.21779876160645)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(97.63445226716456)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(101.0511057727227)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;">5%</text>
        </g>
        <g transform="rotate(104.46775927828082)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(107.88441278383897)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(111.30106628939708)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(114.71771979495523)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(118.1343733005134)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;">10%</text>
        </g>
        <g transform="rotate(121.55102680607152)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(124.96768031162966)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(128.38433381718784)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(131.80098732274595)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(135.2176408283041)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;">15%</text>
        </g>
        <g transform="rotate(138.63429433386221)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(142.05094783942036)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(145.46760134497848)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(148.88425485053662)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(152.30090835609477)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;">20%</text>
        </g>
        <g transform="rotate(155.7175618616529)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(159.13421536721106)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(162.55086887276917)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(165.96752237832732)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(169.38417588388546)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;">25%</text>
        </g>
        <g transform="rotate(172.8008293894436)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(176.2174828950017)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(179.63413640055984)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(183.05078990611798)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(186.46744341167613)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;">30%</text>
        </g>
        <g transform="rotate(189.88409691723427)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(193.30075042279242)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(196.71740392835056)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(200.13405743390865)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(203.5507109394668)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;">35%</text>
        </g>
        <g transform="rotate(206.96736444502494)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(210.3840179505831)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(213.80067145614123)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
    </g>
    <text dy=".35em" class="titles" text-anchor="end" transform="rotate(148.95241708797252)translate(292.9)rotate(180)"
        opacity="0" style="opacity: 1;">Samsung</text>
    <path d="M26.000131034796894,246.04607341344303A247.41600000000003,247.41600000000003 0 0,1 -205.26917320139876,-138.12763513943966L-197.37420500134496,-132.81503378792274A237.9,237.9 0 0,0 25.00012599499701,236.58276289754136Z"
        style="stroke: rgb(16, 33, 139); fill: rgb(16, 33, 139); opacity: 1;"></path>
</g>
<g class="group Sony">
    <g class="ticks Sony">
        <g transform="rotate(216.2288271115363)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;">0%</text>
        </g>
        <g transform="rotate(219.64548061709445)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(223.0621341226526)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(226.47878762821074)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(229.89544113376888)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
    </g>
    <text dy=".35em" class="titles" text-anchor="end" transform="rotate(223.79620212832174)translate(292.9)rotate(180)"
        opacity="0" style="opacity: 1;">Sony</text>
    <path d="M-199.58134759504787,-146.22572532952157A247.41600000000003,247.41600000000003 0 0,1 -154.48068223612847,-193.26250508533803L-148.53911753473892,-185.82933181282502A237.9,237.9 0 0,0 -191.90514191831525,-140.60165897069382Z"
        style="stroke: rgb(19, 75, 36); fill: rgb(19, 75, 36); opacity: 1;"></path>
</g>
<g class="group Other">
    <g class="ticks Other">
        <g transform="rotate(233.6554083256305)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;">0%</text>
        </g>
        <g transform="rotate(237.07206183118865)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(240.4887153367468)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(243.90536884230494)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(247.32202234786303)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(250.73867585342117)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;">5%</text>
        </g>
        <g transform="rotate(254.15532935897932)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(257.57198286453746)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(260.98863637009555)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
        <g transform="rotate(264.40528987565375)translate(247.4160000000000340,0)">
            <line x1="1" y1="0" x2="5" y2="0" class="ticks" style="stroke: rgb(0, 0, 0);"></line>
            <text x="8" dy=".35em" class="tickLabels" transform="rotate(180)translate(-16)" opacity="0"
                style="text-anchor: end; opacity: 1;"></text>
        </g>
    </g>
    <text dy=".35em" class="titles" text-anchor="end" transform="rotate(250.68178857255367)translate(292.9)rotate(180)"
        opacity="0" style="opacity: 1;">Other</text>
    <path d="M-146.62867526579655,-199.28549532215732A247.41600000000003,247.41600000000003 0 0,1 -9.894001107119895,-247.21809358963256L-9.513462602999898,-237.7097053746467A237.9,237.9 0 0,0 -140.98911083249666,-191.62066857899742Z"
        style="stroke: rgb(115, 115, 115); fill: rgb(115, 115, 115); opacity: 1;"></path>
</g>
<path class="chord" d="M25.00012599499701,236.58276289754136A237.9,237.9 0 0,1 -186.12995506800792,148.16224156775354Q 0,0 25.00012599499701,236.58276289754136Z"
    opacity="0" style="stroke: rgb(11, 23, 97); fill: rgb(16, 33, 139); opacity: 0.8;"></path>
<path class="chord" d="M211.24899108604123,109.40874629173703A237.9,237.9 0 0,1 108.20186589018336,211.86969159812068Q 0,0 211.24899108604123,109.40874629173703Z"
    opacity="0" style="stroke: rgb(0, 100, 140); fill: rgb(0, 143, 200); opacity: 0.8;"></path>
<path class="chord" d="M1.4567173675857766e-14,-237.9A237.9,237.9 0 0,1 129.942110959426,-199.27733890086003Q 0,0 1.4567173675857766e-14,-237.9Z"
    opacity="0" style="stroke: rgb(137, 137, 137); fill: rgb(196, 196, 196); opacity: 0.8;"></path>
<path class="chord" d="M-140.98911083249666,-191.62066857899742A237.9,237.9 0 0,1 -72.74255709631518,-226.5059168920082Q 0,0 -140.98911083249666,-191.62066857899742Z"
    opacity="0" style="stroke: rgb(80, 80, 80); fill: rgb(115, 115, 115); opacity: 0.8;"></path>
<path class="chord" d="M-186.12995506800792,148.16224156775354A237.9,237.9 0 0,1 -235.20686923519247,35.69507899667789Q 0,0 71.16207563223077,227.0074205653037A237.9,237.9 0 0,1 54.49827517837491,231.57363408337773Q 0,0 -186.12995506800792,148.16224156775354Z"
    opacity="0.8" style="stroke: rgb(11, 23, 97); fill: rgb(16, 33, 139);"></path>
<path class="chord" d="M-235.20686923519247,35.69507899667789A237.9,237.9 0 0,1 -233.93278092798874,-43.26504371080226Q 0,0 -49.986229946520076,-232.58930933242317A237.9,237.9 0 0,1 -29.079931383841636,-236.11600452047097Q 0,0 -235.20686923519247,35.69507899667789Z"
    opacity="0" style="stroke: rgb(11, 23, 97); fill: rgb(16, 33, 139); opacity: 0.8;"></path>
<path class="chord" d="M108.20186589018336,211.86969159812068A237.9,237.9 0 0,1 71.16207563223077,227.0074205653037Q 0,0 -72.74255709631518,-226.5059168920082A237.9,237.9 0 0,1 -49.986229946520076,-232.58930933242317Q 0,0 108.20186589018336,211.86969159812068Z"
    opacity="0" style="stroke: rgb(0, 100, 140); fill: rgb(0, 143, 200); opacity: 0.8;"></path>
<path class="chord" d="M-233.93278092798874,-43.26504371080226A237.9,237.9 0 0,1 -224.43435639731172,-78.90265945153226Q 0,0 232.5061243228008,-50.37173962044894A237.9,237.9 0 0,1 235.20665637463995,-35.69648157818991Q 0,0 -233.93278092798874,-43.26504371080226Z"
    opacity="0" style="stroke: rgb(11, 23, 97); fill: rgb(16, 33, 139); opacity: 0.8;"></path>
<path class="chord" d="M220.18521442644067,-90.08263621798791A237.9,237.9 0 0,1 228.6754058295011,-65.60463984134788Q 0,0 220.18521442644067,-90.08263621798791Z"
    opacity="0" style="stroke: rgb(73, 125, 10); fill: rgb(105, 180, 15); opacity: 0.8;"></path>
<path class="chord" d="M183.60156576024573,-151.28408723453424A237.9,237.9 0 0,1 203.56885130561298,-123.110246438358Q 0,0 -206.1019106963857,-118.82092579718041A237.9,237.9 0 0,1 -197.37420500134496,-132.81503378792274Q 0,0 183.60156576024573,-151.28408723453424Z"
    opacity="0" style="stroke: rgb(137, 137, 137); fill: rgb(196, 196, 196); opacity: 0.8;"></path>
<path class="chord" d="M-191.90514191831525,-140.60165897069382A237.9,237.9 0 0,1 -176.00630663992118,-160.05683372781695Q 0,0 -191.90514191831525,-140.60165897069382Z"
    opacity="0" style="stroke: rgb(13, 52, 25); fill: rgb(19, 75, 36); opacity: 0.8;"></path>
<path class="chord" d="M129.942110959426,-199.27733890086003A237.9,237.9 0 0,1 158.59775330722476,-177.32220009322202Q 0,0 37.5470093333558,234.91835196536027A237.9,237.9 0 0,1 34.44091572904592,235.39378352825028Q 0,0 129.942110959426,-199.27733890086003Z"
    opacity="0" style="stroke: rgb(137, 137, 137); fill: rgb(196, 196, 196); opacity: 0.8;"></path>
<path class="chord" d="M158.59775330722476,-177.32220009322202A237.9,237.9 0 0,1 183.60156576024573,-151.28408723453424Q 0,0 -14.220246356940953,-237.4746188407256A237.9,237.9 0 0,1 -11.082424199627907,-237.64172586871084Q 0,0 158.59775330722476,-177.32220009322202Z"
    opacity="0" style="stroke: rgb(137, 137, 137); fill: rgb(196, 196, 196); opacity: 0.8;"></path>
<path class="chord" d="M-224.43435639731172,-78.90265945153226A237.9,237.9 0 0,1 -215.19743452850597,-101.42225678986536Q 0,0 -176.00630663992118,-160.05683372781695A237.9,237.9 0 0,1 -167.30923863586057,-169.12725583739794Q 0,0 -224.43435639731172,-78.90265945153226Z"
    opacity="0" style="stroke: rgb(11, 23, 97); fill: rgb(16, 33, 139); opacity: 0.8;"></path>
<path class="chord" d="M235.20686923519244,35.69507899667798A237.9,237.9 0 0,1 231.99580287771806,52.67216956916604Q 0,0 235.20686923519244,35.69507899667798Z"
    opacity="0" style="stroke: rgb(140, 12, 64); fill: rgb(200, 18, 92); opacity: 0.8;"></path>
<path class="chord" d="M-215.19743452850597,-101.42225678986536A237.9,237.9 0 0,1 -206.1019106963857,-118.82092579718041Q 0,0 223.03902473158962,82.76474760899937A237.9,237.9 0 0,1 219.58521782441542,91.5354691526953Q 0,0 -215.19743452850597,-101.42225678986536Z"
    opacity="0" style="stroke: rgb(11, 23, 97); fill: rgb(16, 33, 139); opacity: 0.8;"></path>
<path class="chord" d="M228.6754058295011,-65.60463984134788A237.9,237.9 0 0,1 232.5061243228008,-50.37173962044894Q 0,0 47.594122888315255,233.09056065506374A237.9,237.9 0 0,1 41.42070057465574,234.266377365393Q 0,0 228.6754058295011,-65.60463984134788Z"
    opacity="0" style="stroke: rgb(73, 125, 10); fill: rgb(105, 180, 15); opacity: 0.8;"></path>
<path class="chord" d="M231.99580287771806,52.67216956916604A237.9,237.9 0 0,1 227.78894762028057,68.61927820988119Q 0,0 41.42070057465574,234.266377365393A237.9,237.9 0 0,1 37.5470093333558,234.91835196536027Q 0,0 231.99580287771806,52.67216956916604Z"
    opacity="0" style="stroke: rgb(140, 12, 64); fill: rgb(200, 18, 92); opacity: 0.8;"></path>
<path class="chord" d="M227.78894762028057,68.61927820988119A237.9,237.9 0 0,1 223.03902473158962,82.76474760899937Q 0,0 -18.921449923471954,-237.14634454866376A237.9,237.9 0 0,1 -14.220246356940953,-237.4746188407256Q 0,0 227.78894762028057,68.61927820988119Z"
    opacity="0" style="stroke: rgb(140, 12, 64); fill: rgb(200, 18, 92); opacity: 0.8;"></path>
<path class="chord" d="M-29.079931383841636,-236.11600452047097A237.9,237.9 0 0,1 -18.921449923471954,-237.14634454866376Q 0,0 236.16337449877568,-28.69269149715707A237.9,237.9 0 0,1 236.911586421971,-21.663568935541562Q 0,0 -29.079931383841636,-236.11600452047097Z"
    opacity="0" style="stroke: rgb(80, 80, 80); fill: rgb(115, 115, 115); opacity: 0.8;"></path>
<path class="chord" d="M203.56885130561298,-123.110246438358A237.9,237.9 0 0,1 209.7854852242614,-112.18939428137227Q 0,0 237.17705449951188,-18.532534066758796A237.9,237.9 0 0,1 237.29422378156056,-16.96647753385053Q 0,0 203.56885130561298,-123.110246438358Z"
    opacity="0" style="stroke: rgb(137, 137, 137); fill: rgb(196, 196, 196); opacity: 0.8;"></path>
<path class="chord" d="M54.49827517837491,231.57363408337773A237.9,237.9 0 0,1 47.594122888315255,233.09056065506374Q 0,0 -162.21057965561351,-174.02338304891632A237.9,237.9 0 0,1 -157.55735782788773,-178.24726924779227Q 0,0 54.49827517837491,231.57363408337773Z"
    opacity="0" style="stroke: rgb(0, 100, 140); fill: rgb(0, 143, 200); opacity: 0.8;"></path>
<path class="chord" d="M237.78289185264046,-7.46366814612575A237.9,237.9 0 0,1 237.86080790957334,4.318108452210987Q 0,0 -197.37420500134496,-132.81503378792274A237.9,237.9 0 0,1 -197.37420500134496,-132.81503378792274Q 0,0 237.78289185264046,-7.46366814612575Z"
    opacity="0" style="stroke: rgb(165, 20, 25); fill: rgb(236, 29, 37); opacity: 0.8;"></path>
<path class="chord" d="M219.58521782441542,91.5354691526953A237.9,237.9 0 0,1 216.76874781779773,98.01897759874878Q 0,0 -152.794190490685,-182.34677225631464A237.9,237.9 0 0,1 -149.15221250198616,-185.33760413300473Q 0,0 219.58521782441542,91.5354691526953Z"
    opacity="0" style="stroke: rgb(140, 12, 64); fill: rgb(200, 18, 92); opacity: 0.8;"></path>
<path class="chord" d="M-167.30923863586057,-169.12725583739794A237.9,237.9 0 0,1 -162.21057965561351,-174.02338304891632Q 0,0 236.911586421971,-21.663568935541562A237.9,237.9 0 0,1 237.17705449951188,-18.532534066758796Q 0,0 -167.30923863586057,-169.12725583739794Z"
    opacity="0" style="stroke: rgb(13, 52, 25); fill: rgb(19, 75, 36); opacity: 0.8;"></path>
<path class="chord" d="M209.7854852242614,-112.18939428137227A237.9,237.9 0 0,1 213.37475568964663,-105.2027738911081Q 0,0 -149.15221250198616,-185.33760413300473A237.9,237.9 0 0,1 -148.53911753473892,-185.82933181282502Q 0,0 209.7854852242614,-112.18939428137227Z"
    opacity="0" style="stroke: rgb(137, 137, 137); fill: rgb(196, 196, 196); opacity: 0.8;"></path>
<path class="chord" d="M235.20665637463995,-35.69648157818991A237.9,237.9 0 0,1 236.16337449877568,-28.69269149715707Q 0,0 216.76874781779773,98.01897759874878A237.9,237.9 0 0,1 216.11698213093308,99.44777541311801Q 0,0 235.20665637463995,-35.69648157818991Z"
    opacity="0" style="stroke: rgb(73, 125, 10); fill: rgb(105, 180, 15); opacity: 0.8;"></path>
<path class="chord" d="M-157.55735782788773,-178.24726924779227A237.9,237.9 0 0,1 -152.794190490685,-182.34677225631464Q 0,0 -11.082424199627907,-237.64172586871084A237.9,237.9 0 0,1 -9.513462602999898,-237.7097053746467Q 0,0 -157.55735782788773,-178.24726924779227Z"
    opacity="0" style="stroke: rgb(13, 52, 25); fill: rgb(19, 75, 36); opacity: 0.8;"></path>
<path class="chord" d="M213.37475568964663,-105.2027738911081A237.9,237.9 0 0,1 216.07911697216036,-99.53002164438345Q 0,0 216.11698213093308,99.44777541311801A237.9,237.9 0 0,1 215.78726726613766,100.16119650749222Q 0,0 213.37475568964663,-105.2027738911081Z"
    opacity="0" style="stroke: rgb(137, 137, 137); fill: rgb(196, 196, 196); opacity: 0.8;"></path>
<path class="chord" d="M237.18431067724802,18.439435147495644A237.9,237.9 0 0,1 236.9200716239203,21.570573977446056Q 0,0 237.18431067724802,18.439435147495644Z"
    opacity="0" style="stroke: rgb(165, 20, 25); fill: rgb(236, 29, 37); opacity: 0.8;"></path>
<path class="chord" d="M237.86080790957334,4.318108452210987A237.9,237.9 0 0,1 237.6974782749528,9.814215288465235Q 0,0 34.44091572904592,235.39378352825028A237.9,237.9 0 0,1 34.44091572904592,235.39378352825028Q 0,0 237.86080790957334,4.318108452210987Z"
    opacity="0" style="stroke: rgb(165, 20, 25); fill: rgb(236, 29, 37); opacity: 0.8;"></path>
<path class="chord" d="M237.6974782749528,9.814215288465235A237.9,237.9 0 0,1 237.456436708765,14.520697833653651Q 0,0 -9.513462602999898,-237.7097053746467A237.9,237.9 0 0,1 -9.513462602999898,-237.7097053746467Q 0,0 237.6974782749528,9.814215288465235Z"
    opacity="0" style="stroke: rgb(165, 20, 25); fill: rgb(236, 29, 37); opacity: 0.8;"></path>
<path class="chord" d="M237.456436708765,14.520697833653651A237.9,237.9 0 0,1 237.18431067724802,18.439435147495644Q 0,0 237.29422378156056,-16.96647753385053A237.9,237.9 0 0,1 237.29422378156056,-16.96647753385053Q 0,0 237.456436708765,14.520697833653651Z"
    opacity="0" style="stroke: rgb(165, 20, 25); fill: rgb(236, 29, 37); opacity: 0.8;"></path>
<path class="chord" d="M236.9200716239203,21.570573977446056A237.9,237.9 0 0,1 236.61449931505612,24.6979495886866Q 0,0 215.78726726613766,100.16119650749222A237.9,237.9 0 0,1 215.45519734359732,100.8735244632185Q 0,0 236.9200716239203,21.570573977446056Z"
    opacity="0" style="stroke: rgb(165, 20, 25); fill: rgb(236, 29, 37); opacity: 0.8;"></path>
<path class="chord" d="M216.07911697216036,-99.53002164438345A237.9,237.9 0 0,1 216.4067450959357,-98.81563983997025Q 0,0 236.61449931505612,24.6979495886866A237.9,237.9 0 0,1 236.53161602118095,25.479494155273578Q 0,0 216.07911697216036,-99.53002164438345Z"
    opacity="0" style="stroke: rgb(137, 137, 137); fill: rgb(196, 196, 196); opacity: 0.8;"></path>
<path class="chord" d="M236.53161602118095,25.479494155273578A237.9,237.9 0 0,1 236.44615127001546,26.260760643914587Q 0,0 -148.53911753473892,-185.82933181282502A237.9,237.9 0 0,1 -148.53911753473892,-185.82933181282502Q 0,0 236.53161602118095,25.479494155273578Z"
    opacity="0" style="stroke: rgb(165, 20, 25); fill: rgb(236, 29, 37); opacity: 0.8;"></path>
<g class="explanationWrapper">
    <text class="explanation" text-anchor="middle" x="0px" y="0px" dy="1em" opacity="1">
        <tspan x="0px" y="0px" dy="1em"></tspan>
    </text>
    <text class="explanation" text-anchor="middle" x="0px" y="0px" dy="1em" opacity="1">
        <tspan x="0px" y="0px" dy="1em"></tspan>
    </text>
</g>
</g>
`;

const ParallelSetSVG =
`
<filter id="ribbon1saturateleft">
    <feColorMatrix in="SourceGraphic" type="saturate" values="0"></feColorMatrix>
</filter>
<filter id="ribbon1saturateright">
    <feColorMatrix in="SourceGraphic" type="saturate" values="0"></feColorMatrix>
</filter>
<filter id="ribbon2saturateleft">
    <feColorMatrix in="SourceGraphic" type="saturate" values="0"></feColorMatrix>
</filter>
<filter id="ribbon2saturateright">
    <feColorMatrix in="SourceGraphic" type="saturate" values="0"></feColorMatrix>
</filter>
<filter id="ribbon3saturateleft">
    <feColorMatrix in="SourceGraphic" type="saturate" values="0"></feColorMatrix>
</filter>
<filter id="ribbon3saturateright">
    <feColorMatrix in="SourceGraphic" type="saturate" values="0"></feColorMatrix>
</filter>
<g transform="translate(100,100)">
    <g class="ribbon">
        <g class="ribbon1" style="opacity: 0;">
            <g filter="url(#ribbon1saturateleft)" class="left">
                <path d="M0,45C0,137.16666666666669 0,137.16666666666669 0,229.33333333333334h146.91503861880963C146.91503861880963,137.16666666666669 146.91503861880963,137.16666666666669 146.91503861880963,45Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M146.91503861880963,45C146.91503861880963,137.16666666666669 220.726942298955,137.16666666666669 220.726942298955,229.33333333333334h156.73784643343933C377.46478873239437,137.16666666666669 303.65288505224896,137.16666666666669 303.65288505224896,45Z"
                    class="category-0 male" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
            </g>
            <g filter="url(#ribbon1saturateright)" class="right">
                <path d="M323.65288505224896,45C323.65288505224896,137.16666666666669 146.91503861880963,137.16666666666669 146.91503861880963,229.33333333333334h53.811903680145384C200.726942298955,137.16666666666669 377.46478873239437,137.16666666666669 377.46478873239437,45Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M377.46478873239437,45C377.46478873239437,137.16666666666669 377.46478873239437,137.16666666666669 377.46478873239437,229.33333333333334h582.5352112676056C960,137.16666666666669 960,137.16666666666669 960,45Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
            </g>
        </g>
        <g class="ribbon2" style="opacity: 0;">
            <g filter="url(#ribbon2saturateleft)" class="left">
                <path d="M233.11222171740118,229.33333333333334C233.11222171740118,321.5 201.50840527033168,321.5 201.50840527033168,413.6666666666667h144.35256701499318C345.86097228532486,321.5 377.46478873239437,321.5 377.46478873239437,229.33333333333334Z"
                    class="category-0 male" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M220.726942298955,229.33333333333334C220.726942298955,321.5 11.958200817810086,321.5 11.958200817810086,413.6666666666667h12.385279418446162C24.343480236256248,321.5 233.11222171740118,321.5 233.11222171740118,229.33333333333334Z"
                    class="category-0 male" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M11.958200817810086,229.33333333333334C11.958200817810086,321.5 66.55156746933213,321.5 66.55156746933213,413.6666666666667h134.95683780099955C201.50840527033168,321.5 146.91503861880963,321.5 146.91503861880963,229.33333333333334Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M0,229.33333333333334C0,321.5 0,321.5 0,413.6666666666667h11.958200817810086C11.958200817810086,321.5 11.958200817810086,321.5 11.958200817810086,229.33333333333334Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
            </g>
            <g filter="url(#ribbon2saturateright)" class="right">
                <path d="M154.1753748296229,229.33333333333334C154.1753748296229,321.5 345.8609722853248,321.5 345.8609722853248,413.6666666666667h46.55156746933212C392.4125397546569,321.5 200.72694229895504,321.5 200.72694229895504,229.33333333333334Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M146.91503861880963,229.33333333333334C146.91503861880963,321.5 24.343480236256248,321.5 24.343480236256248,413.6666666666667h7.260336210813266C31.603816447069512,321.5 154.1753748296229,321.5 154.1753748296229,229.33333333333334Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M392.41253975465696,229.33333333333334C392.41253975465696,321.5 392.4125397546569,321.5 392.4125397546569,413.6666666666667h567.5874602453431C960,321.5 960,321.5 960,229.33333333333334Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M377.46478873239437,229.33333333333334C377.46478873239437,321.5 31.603816447069512,321.5 31.603816447069512,413.6666666666667h14.947751022262606C46.55156746933212,321.5 392.41253975465696,321.5 392.41253975465696,229.33333333333334Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
            </g>
        </g>
        <g class="ribbon3" style="opacity: 0;">
            <g filter="url(#ribbon3saturateleft)" class="left">
                <path d="M5.979100408905044,413.6666666666667C5.979100408905044,505.83333333333337 273.85127972133876,505.83333333333337 273.85127972133876,598h5.979100408905043C279.8303801302438,505.83333333333337 11.958200817810088,505.83333333333337 11.958200817810088,413.6666666666667Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M0,413.6666666666667C0,505.83333333333337 0,505.83333333333337 0,598h5.552021808268969C5.552021808268969,505.83333333333337 5.552021808268969,505.83333333333337 5.552021808268969,413.6666666666667Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M5.552021808268969,413.6666666666667C5.552021808268969,505.83333333333337 128.3840678479479,505.83333333333337 128.3840678479479,598h0.4270786006360745C128.81114644858397,505.83333333333337 5.979100408905044,505.83333333333337 5.979100408905044,413.6666666666667Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M18.79145842798728,413.6666666666667C18.79145842798728,505.83333333333337 312.2883537785855,505.83333333333337 312.2883537785855,598h5.552021808268969C317.84037558685446,505.83333333333337 24.343480236256248,505.83333333333337 24.343480236256248,413.6666666666667Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M11.958200817810088,413.6666666666667C11.958200817810088,505.83333333333337 39.71830985915493,505.83333333333337 39.71830985915493,598h4.69786460699682C44.416174466151745,505.83333333333337 16.656065424806908,505.83333333333337 16.656065424806908,413.6666666666667Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M16.656065424806908,413.6666666666667C16.656065424806908,505.83333333333337 188.6021505376344,505.83333333333337 188.6021505376344,598h2.1353930031803725C190.73754354081478,505.83333333333337 18.79145842798728,505.83333333333337 18.79145842798728,413.6666666666667Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M100.71785552021808,413.6666666666667C100.71785552021808,505.83333333333337 128.81114644858397,505.83333333333337 128.81114644858397,598h59.791004089050425C188.6021505376344,505.83333333333337 160.5088596092685,505.83333333333337 160.5088596092685,413.6666666666667Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M66.55156746933213,413.6666666666667C66.55156746933213,505.83333333333337 5.552021808268969,505.83333333333337 5.552021808268969,598h34.16628805088596C39.71830985915493,505.83333333333337 100.71785552021808,505.83333333333337 100.71785552021808,413.6666666666667Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M160.5088596092685,413.6666666666667C160.5088596092685,505.83333333333337 279.8303801302438,505.83333333333337 279.8303801302438,598h32.457973648341664C312.2883537785855,505.83333333333337 192.96683325761018,505.83333333333337 192.96683325761018,413.6666666666667Z"
                    class="category-0" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M192.96683325761018,413.6666666666667C192.96683325761018,505.83333333333337 582.035438437074,505.83333333333337 582.035438437074,598h8.54157201272149C590.5770104497956,505.83333333333337 201.50840527033168,505.83333333333337 201.50840527033168,413.6666666666667Z"
                    class="category-0 male" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M263.8618809631986,413.6666666666667C263.8618809631986,505.83333333333337 590.5770104497956,505.83333333333337 590.5770104497956,598h81.9990913221263C672.5761017719219,505.83333333333337 345.8609722853249,505.83333333333337 345.8609722853249,413.6666666666667Z"
                    class="category-0 male" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M231.830985915493,413.6666666666667C231.830985915493,505.83333333333337 317.8403755868544,505.83333333333337 317.8403755868544,598h32.03089504770559C349.87127063456,505.83333333333337 263.8618809631986,505.83333333333337 263.8618809631986,413.6666666666667Z"
                    class="category-0 male" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M207.48750567923673,413.6666666666667C207.48750567923673,505.83333333333337 190.73754354081478,505.83333333333337 190.73754354081478,598h24.343480236256244C215.08102377707104,505.83333333333337 231.830985915493,505.83333333333337 231.830985915493,413.6666666666667Z"
                    class="category-0 male" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
                <path d="M201.50840527033168,413.6666666666667C201.50840527033168,505.83333333333337 44.416174466151745,505.83333333333337 44.416174466151745,598h5.979100408905043C50.395274875056785,505.83333333333337 207.48750567923673,505.83333333333337 207.48750567923673,413.6666666666667Z"
                    class="category-0 male" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180);"></path>
            </g>
            <g filter="url(#ribbon3saturateright)" class="right">
                <path d="M353.1213084961382,413.6666666666667C353.1213084961382,505.83333333333337 357.1316068453733,505.83333333333337 357.1316068453733,598h38.00999545661063C395.14160230198394,505.83333333333337 391.13130395274885,505.83333333333337 391.13130395274885,413.6666666666667Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M345.8609722853249,413.6666666666667C345.8609722853249,505.83333333333337 50.395274875056785,505.83333333333337 50.395274875056785,598h5.552021808268969C55.94729668332575,505.83333333333337 351.4129940935939,505.83333333333337 351.4129940935939,413.6666666666667Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M351.41299409359385,413.6666666666667C351.41299409359385,505.83333333333337 215.08102377707104,505.83333333333337 215.08102377707104,598h1.708314402544298C216.78933817961533,505.83333333333337 353.12130849613817,505.83333333333337 353.12130849613817,413.6666666666667Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M391.1313039527488,413.6666666666667C391.1313039527488,505.83333333333337 672.5761017719218,505.83333333333337 672.5761017719218,598h1.2812358019082235C673.85733757383,505.83333333333337 392.412539754657,505.83333333333337 392.412539754657,413.6666666666667Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M673.85733757383,413.6666666666667C673.85733757383,505.83333333333337 673.85733757383,505.83333333333337 673.85733757383,598h286.1426624261699C960,505.83333333333337 960,505.83333333333337 960,413.6666666666667Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M508.57791912766925,413.6666666666667C508.57791912766925,505.83333333333337 410.08935332424653,505.83333333333337 410.08935332424653,598h165.27941844616083C575.3687717704074,505.83333333333337 673.8573375738301,505.83333333333337 673.8573375738301,413.6666666666667Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M392.412539754657,413.6666666666667C392.412539754657,505.83333333333337 55.94729668332575,505.83333333333337 55.94729668332575,598h65.77010449795547C121.71740118128122,505.83333333333337 458.1826442526125,505.83333333333337 458.1826442526125,413.6666666666667Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M458.1826442526125,413.6666666666667C458.1826442526125,505.83333333333337 216.78933817961533,505.83333333333337 216.78933817961533,598h50.39527487505679C267.1846130546721,505.83333333333337 508.57791912766925,505.83333333333337 508.57791912766925,413.6666666666667Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M24.343480236256248,413.6666666666667C24.343480236256248,505.83333333333337 349.87127063456,505.83333333333337 349.87127063456,598h7.260336210813266C357.13160684537326,505.83333333333337 31.603816447069512,505.83333333333337 31.603816447069512,413.6666666666667Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
                <path d="M31.603816447069512,413.6666666666667C31.603816447069512,505.83333333333337 395.1416023019839,505.83333333333337 395.1416023019839,598h14.947751022262606C410.0893533242465,505.83333333333337 46.55156746933212,505.83333333333337 46.55156746933212,413.6666666666667Z"
                    class="category-1" style="stroke-opacity: 0; fill-opacity: 0.5; fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14);"></path>
            </g>
        </g>
    </g>
    <g transform="translate(0,45)" class="dimension">
        <rect width="960" y="-45" height="45" style="display: none;"></rect>
        <text transform="translate(0,-25)" class="dimension" style="opacity: 0;">
            <tspan class="name" style="font-size: 1.5em; fill: rgb(51, 51, 51); font-weight: bold;">Survived</tspan>
            <tspan dx="2em" class="sort alpha">alpha »</tspan>
            <tspan dx="2em" class="sort size">size »</tspan>
        </text>
        <g transform="translate(0)" class="category" style="opacity: 0;">
            <rect width="303.65288505224896" y="-20" height="20" class="category-0" style="fill: rgb(31, 119, 180); stroke: rgb(31, 119, 180); display: none;"></rect>
            <line data-v-7057edc8="" x2="303.65288505224896" style="stroke-width: 2; stroke: rgb(0, 0, 0);"></line>
            <text dy="-.3em">Survived</text>
        </g>
        <g transform="translate(323.65288505224896)" class="category" style="opacity: 0;">
            <rect width="636.347114947751" y="-20" height="20" class="category-1" style="fill: rgb(255, 127, 14); stroke: rgb(255, 127, 14); display: none;"></rect>
            <line data-v-7057edc8="" x2="636.347114947751" style="stroke-width: 2; stroke: rgb(0, 0, 0);"></line>
            <text dy="-.3em">Perished</text>
        </g>
    </g>
    <g transform="translate(0,229.33333333333334)" class="dimension">
        <rect width="960" y="-45" height="45" style="display: none;"></rect>
        <text transform="translate(0,-25)" class="dimension" style="opacity: 0;">
            <tspan class="name" style="font-size: 1.5em; fill: rgb(51, 51, 51); font-weight: bold;">Sex</tspan>
            <tspan dx="2em" class="sort alpha">alpha »</tspan>
            <tspan dx="2em" class="sort size">size »</tspan>
        </text>
        <g transform="translate(0)" class="category" style="opacity: 0;">
            <rect width="200.726942298955" y="-20" height="20" class="category-background" style="display: none;"></rect>
            <line data-v-7057edc8="" x2="200.726942298955" style="stroke-width: 2; stroke: rgb(0, 0, 0);"></line>
            <text dy="-.3em">Female</text>
        </g>
        <g transform="translate(220.726942298955)" class="category" style="opacity: 0;">
            <rect width="739.273057701045" y="-20" height="20" class="category-background" style="display: none;"></rect>
            <line data-v-7057edc8="" x2="739.273057701045" style="stroke-width: 2; stroke: rgb(0, 0, 0);"></line>
            <text dy="-.3em">Male</text>
        </g>
    </g>
    <g transform="translate(0,413.6666666666667)" class="dimension">
        <rect width="960" y="-45" height="45" style="display: none;"></rect>
        <text transform="translate(0,-25)" class="dimension" style="opacity: 0;">
            <tspan class="name" style="font-size: 1.5em; fill: rgb(51, 51, 51); font-weight: bold;">Age</tspan>
            <tspan dx="2em" class="sort alpha">alpha »</tspan>
            <tspan dx="2em" class="sort size">size »</tspan>
        </text>
        <g transform="translate(0)" class="category" style="opacity: 0;">
            <rect width="46.55156746933212" y="-20" height="20" class="category-background" style="display: none;"></rect>
            <line data-v-7057edc8="" x2="46.55156746933212" style="stroke-width: 2; stroke: rgb(0, 0, 0);"></line>
            <text dy="-.3em">Child</text>
        </g>
        <g transform="translate(66.55156746933213)" class="category" style="opacity: 0;">
            <rect width="893.4484325306679" y="-20" height="20" class="category-background" style="display: none;"></rect>
            <line data-v-7057edc8="" x2="893.4484325306679" style="stroke-width: 2; stroke: rgb(0, 0, 0);"></line>
            <text dy="-.3em">Adult</text>
        </g>
    </g>
    <g transform="translate(0,598)" class="dimension">
        <rect width="960" y="-45" height="45" style="display: none;"></rect>
        <text transform="translate(0,-25)" class="dimension" style="opacity: 0;">
            <tspan class="name" style="font-size: 1.5em; fill: rgb(51, 51, 51); font-weight: bold;">Class</tspan>
            <tspan dx="2em" class="sort alpha">alpha »</tspan>
            <tspan dx="2em" class="sort size">size »</tspan>
        </text>
        <g transform="translate(0)" class="category" style="opacity: 0;">
            <rect width="121.71740118128125" y="-20" height="20" class="category-background" style="display: none;"></rect>
            <line data-v-7057edc8="" x2="121.71740118128125" style="stroke-width: 2; stroke: rgb(0, 0, 0);"></line>
            <text dy="-.3em">Second Class</text>
        </g>
        <g transform="translate(128.3840678479479)" class="category" style="opacity: 0;">
            <rect width="138.80054520672422" y="-20" height="20" class="category-background" style="display: none;"></rect>
            <line data-v-7057edc8="" x2="138.80054520672422" style="stroke-width: 2; stroke: rgb(0, 0, 0);"></line>
            <text dy="-.3em">First Class</text>
        </g>
        <g transform="translate(273.85127972133876)" class="category" style="opacity: 0;">
            <rect width="301.5174920490686" y="-20" height="20" class="category-background" style="display: none;"></rect>
            <line data-v-7057edc8="" x2="301.5174920490686" style="stroke-width: 2; stroke: rgb(0, 0, 0);"></line>
            <text dy="-.3em">Third Class</text>
        </g>
        <g transform="translate(582.035438437074)" class="category" style="opacity: 0;">
            <rect width="377.96456156292595" y="-20" height="20" class="category-background" style="display: none;"></rect>
            <line data-v-7057edc8="" x2="377.96456156292595" style="stroke-width: 2; stroke: rgb(0, 0, 0);"></line>
            <text dy="-.3em">Crew</text>
        </g>
    </g>
</g>`;

function parallelSetAnimation(svg) {
    const duration = 600;
    const delta = 300;

    document.getElementById("previewCanvas").innerHTML = ParallelSetSVG;

    var defs = svg.append("defs");
    var arrowMarker = defs.append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", "12")
        .attr("markerHeight", "12")
        .attr("viewBox", "0 0 12 12") 
        .attr("refX", "6")
        .attr("refY", "6")
        .attr("orient", "auto");
    var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
    arrowMarker.append("path")
        .attr("d", arrow_path)
        .attr("fill", 'var(--color-blue-dark)');    

    const animations = [];

    animations.push([() => svg.selectAll("g.dimension")
        .transition().duration(duration)
        .delay((d, i) => i * duration)
        .selectAll(".category")
        .style("opacity", 1)
    , duration * 4]);

    animations.push([() => svg.selectAll("g.dimension")
        .transition().duration(duration)
        .delay((d, i) => i * duration + (i != 0) * duration * 6)
        .select("text.dimension")
        .style("opacity", 1)
    , duration]);

    animations.push([() => svg.append('line')
            .style("opacity", 0)
            .style('stroke', 'var(--color-blue-dark)')
            .style('stroke-width', '2')
            .attr('x1', 130)
            .attr('y1', 260)
            .attr('x2', 150)
            .attr('y2', 150)
            .style('fill', 'none')
            .style('stroke-width', 2)
            .attr("marker-end", "url(#arrow)")
            .transition().duration(duration)
            .style("opacity", 1)
            .transition().duration(duration * 3)
            .transition().duration(duration * 0.5)
            .style("opacity", 0)
            .remove()
    , duration]);

    animations.push([() => svg.append('text')
        .style('opacity', 0)
        .text("The length of 'Survived' means the percentage of survived people.")
        .attr("transform", "translate(100, 270)")
        .attr('font-family', 'Source Sans Pro')
        .attr('font-size', 24)
        .style('fill', 'var(--color-blue-dark)')
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration * 0.5)
        .style('opacity', 0)
        .remove()
    , duration * 6]);

    animations.push([() => svg.selectAll(".ribbon1")
        .attr("transform", "translate(0, 45) scale(1, 0) ")
        .style("opacity", 1)
        .transition().duration(duration * 2)
        .attr("transform", "translate(0, 0) scale(1, 1) ")
    , duration]);

    animations.push([() => svg.selectAll(".ribbon2")
        .attr("transform", "translate(0, 229.3) scale(1, 0) ")
        .style("opacity", 1)
        .transition().duration(duration * 2)
        .attr("transform", "translate(0, 0) scale(1, 1) ")
    , duration]);

    animations.push([() => svg.selectAll(".ribbon3")
        .attr("transform", "translate(0, 413.6) scale(1, 0) ")
        .style("opacity", 1)
        .transition().duration(duration * 2)
        .attr("transform", "translate(0, 0) scale(1, 1) ")
    , duration]);

    animations.push([() => svg.selectAll("#ribbon1saturateleft")
        .select("feColorMatrix")
        .transition().duration(duration)
        .attr("values", 1)
    , duration]);

    animations.push([() => svg.append('line')
        .style("opacity", 0)
        .style('stroke', 'var(--color-blue-dark)')
        .style('stroke-width', '2')
        .attr('x1', 230)
        .attr('y1', 30)
        .attr('x2', 250)
        .attr('y2', 130)
        .style('fill', 'none')
        .style('stroke-width', 2)
        .attr("marker-end", "url(#arrow)")
        .transition().duration(duration)
        .style("opacity", 1)
        .transition().duration(duration * 3)
        .transition().duration(duration * 0.5)
        .style("opacity", 0)
        .remove()
    , duration]);

    animations.push([() => svg.append('text')
        .style('opacity', 0)
        .text("the color blue for survived people")
        .attr("transform", "translate(200, 20)")
        .attr('font-family', 'Source Sans Pro')
        .attr('font-size', 24)
        .style('fill', 'var(--color-blue-dark)')
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration * 0.5)
        .style('opacity', 0)
        .remove()
    , duration * 3]);

    animations.push([() => svg.selectAll("#ribbon2saturateleft")
        .select("feColorMatrix")
        .transition().duration(duration)
        .attr("values", 1)
    , duration]);

    animations.push([() => svg.selectAll("#ribbon3saturateleft")
        .select("feColorMatrix")
        .transition().duration(duration)
        .attr("values", 1)
    , duration]);

    animations.push([() => svg.selectAll("#ribbon1saturateright")
        .select("feColorMatrix")
        .transition().duration(duration)
        .attr("values", 1)
    , duration]);
    
    animations.push([() => svg.append('line')
        .style("opacity", 0)
        .style('stroke', 'var(--color-blue-dark)')
        .style('stroke-width', '2')
        .attr('x1', 530)
        .attr('y1', 30)
        .attr('x2', 550)
        .attr('y2', 130)
        .style('fill', 'none')
        .style('stroke-width', 2)
        .attr("marker-end", "url(#arrow)")
        .transition().duration(duration)
        .style("opacity", 1)
        .transition().duration(duration * 3)
        .transition().duration(duration * 0.5)
        .style("opacity", 0)
        .remove()
    , duration]);

    animations.push([() => svg.append('text')
        .style('opacity', 0)
        .text("the color orange for perished people")
        .attr("transform", "translate(500, 20)")
        .attr('font-family', 'Source Sans Pro')
        .attr('font-size', 24)
        .style('fill', 'var(--color-blue-dark)')
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration * 0.5)
        .style('opacity', 0)
        .remove()
    , duration * 3]);

    animations.push([() => svg.selectAll("#ribbon2saturateright")
        .select("feColorMatrix")
        .transition().duration(duration)
        .attr("values", 1)
    , duration]);

    animations.push([() => svg.selectAll("#ribbon3saturateright")
        .select("feColorMatrix")
        .transition().duration(duration)
        .attr("values", 1)
    , duration]);

    animations.push([() => svg.select(".ribbon1")
        .selectAll(".male")
        .transition().duration(duration)
        .style("fill-opacity", 0.8)
    , duration]);

    animations.push([() => svg.append('line')
        .style("opacity", 0)
        .style('stroke', 'var(--color-blue-dark)')
        .style('stroke-width', '2')
        .attr('x1', 480)
        .attr('y1', 200)
        .attr('x2', 400)
        .attr('y2', 300)
        .style('fill', 'none')
        .style('stroke-width', 2)
        .attr("marker-end", "url(#arrow)")
        .transition().duration(duration)
        .style("opacity", 1)
        .transition().duration(duration * 3)
        .transition().duration(duration * 0.5)
        .style("opacity", 0)
        .remove()
    , duration]);

    animations.push([() => svg.append('text')
        .style('opacity', 0)
        .text("half of the survived people are male")
        .attr("transform", "translate(490, 190)")
        .attr('font-family', 'Source Sans Pro')
        .attr('font-size', 24)
        .style('fill', 'var(--color-blue-dark)')
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration * 0.5)
        .style('opacity', 0)
        .remove()
    , duration * 3]);

    animations.push([() => svg.select(".ribbon2")
        .selectAll(".male")
        .transition().duration(duration)
        .style("fill-opacity", 0.8)
    , duration]);

    animations.push([() => svg.append('line')
        .style("opacity", 0)
        .style('stroke', 'var(--color-blue-dark)')
        .style('stroke-width', '2')
        .attr('x1', 480)
        .attr('y1', 385)
        .attr('x2', 400)
        .attr('y2', 485)
        .style('fill', 'none')
        .style('stroke-width', 2)
        .attr("marker-end", "url(#arrow)")
        .transition().duration(duration)
        .style("opacity", 1)
        .transition().duration(duration * 3)
        .transition().duration(duration * 0.5)
        .style("opacity", 0)
        .remove()
    , duration]);

    animations.push([() => svg.append('text')
        .style('opacity', 0)
        .text("most of them are adults")
        .attr("transform", "translate(490, 375)")
        .attr('font-family', 'Source Sans Pro')
        .attr('font-size', 24)
        .style('fill', 'var(--color-blue-dark)')
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration * 0.5)
        .style('opacity', 0)
        .remove()
    , duration * 3]);

    animations.push([() => svg.select(".ribbon3")
        .selectAll(".male")
        .transition().duration(duration)
        .style("fill-opacity", 0.8)
    , duration]);

    animations.push([() => svg.append('line')
        .style("opacity", 0)
        .style('stroke', 'var(--color-blue-dark)')
        .style('stroke-width', '2')
        .attr('x1', 480)
        .attr('y1', 750)
        .attr('x2', 400)
        .attr('y2', 670)
        .style('fill', 'none')
        .style('stroke-width', 2)
        .attr("marker-end", "url(#arrow)")
        .transition().duration(duration)
        .style("opacity", 1)
        .transition().duration(duration * 3)
        .transition().duration(duration * 0.5)
        .style("opacity", 0)
        .remove()
    , duration]);

    animations.push([() => svg.append('text')
        .style('opacity', 0)
        .text("yet only a small part of male survived")
        .attr("transform", "translate(490, 760)")
        .attr('font-family', 'Source Sans Pro')
        .attr('font-size', 24)
        .style('fill', 'var(--color-blue-dark)')
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration)
        .style('opacity', 1)
        .transition().duration(duration * 0.5)
        .style('opacity', 0)
        .remove()
    , duration * 3]);
    
    var play = (i) => {
        if (i >= animations.length) return;
        animations[i][0]();
        setTimeout(() => play(i + 1), animations[i][1] + delta);
    }

    play(0);
}


function ChordAnimation(svg) {
    const duration = 1000;
    const delta = 300;

    document.getElementById("previewCanvas").innerHTML = ChordDiagramSVG;

    var defs = svg.append("defs");
    var arrowMarker = defs.append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", "12")
        .attr("markerHeight", "12")
        .attr("viewBox", "0 0 12 12") 
        .attr("refX", "6")
        .attr("refY", "6")
        .attr("orient", "auto");
    var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";
    arrowMarker.append("path")
        .attr("d", arrow_path)
        .attr("fill", 'var(--color-blue-dark)');    

    const animations = [];

    svg.selectAll(".group").style("opacity", 0);
    svg.selectAll(".chord").style("opacity", 0);

    animations.push([() => svg.selectAll("g.group")
        .transition().duration(duration)
        .delay((d, i) => i * duration)
        .style("opacity", 1)
    , duration * 10]);

    animations.push([() => svg.selectAll(".chord")
        .transition().duration(duration)
        .delay((d, i) => i * duration)
        .style("opacity", 0.7)
    , duration * 10]);

    var play = (i) => {
        if (i >= animations.length) return;
        animations[i][0]();
        setTimeout(() => play(i + 1), animations[i][1] + delta);
    }

    play(0);
}