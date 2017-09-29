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
            }, {
                value: '4',
                label: 'ComicNarritive',
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
            } else if (this.value == '4') {
                ComicNarritiveAnimation(this.svg);
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

function ComicNarritiveAnimation(svg) {
    const duration = 1000;
    const delta = 300;

    document.getElementById("previewCanvas").innerHTML = ComicNarritiveSVG;

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

    animations.push([() => svg.selectAll("path")
        .transition().duration(duration)
        .delay((d, i) => i * 100)
        .style("opacity", 1)
    , duration * 10]);

    animations.push([() => svg.selectAll("g.node")
        .transition().duration(duration)
        .delay((d, i) => i * 100)
        .selectAll("rect")
        .style("opacity", 0.7)
    , 0]);

    animations.push([() => svg.selectAll("g.node")
        .transition().duration(duration)
        .delay((d, i) => i * 200)
        .selectAll("text")
        .style("opacity", 1)
    , 0]);

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

const ComicNarritiveSVG = `
<g transform="translate(80, 300) scale(1.1)">
<g data-v-7057edc8="">
    <path d="M116.7190082644628,92.2C131.09327036599765,92.2 131.09327036599765,92.2 145.4675324675325,92.2"
        from="tintin23_0" to="tintin23_2" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M145.4675324675325,92.2C156.96694214876035,92.2 156.96694214876035,117.2 168.4663518299882,117.2"
        from="tintin23_2" to="tintin23_3" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M168.4663518299882,117.2C199.51475796930345,117.2 199.51475796930345,92.2 230.56316410861868,92.2"
        from="tintin23_3" to="tintin23_4" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M230.56316410861868,92.2C239.76269185360098,92.2 239.76269185360098,134.86666666666667 248.96221959858326,134.86666666666667"
        from="tintin23_4" to="tintin23_5" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M248.96221959858326,134.86666666666667C250.11216056670605,134.86666666666667 250.11216056670605,97.53333333333333 251.26210153482882,97.53333333333333"
        from="tintin23_5" to="tintin23_6" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M251.26210153482882,97.53333333333333C257.58677685950414,97.53333333333333 257.58677685950414,122.30000000000001 263.9114521841795,122.30000000000001"
        from="tintin23_6" to="tintin23_7" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M263.9114521841795,122.30000000000001C335.20779220779224,122.30000000000001 335.20779220779224,94.30000000000001 406.504132231405,94.30000000000001"
        from="tintin23_7" to="tintin23_17" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M406.504132231405,94.30000000000001C420.8783943329398,94.30000000000001 420.8783943329398,98 435.25265643447466,98"
        from="tintin23_17" to="tintin23_19" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M435.25265643447466,98C449.0519480519481,98 449.0519480519481,100.60000000000001 462.8512396694215,100.60000000000001"
        from="tintin23_19" to="tintin23_20" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M462.8512396694215,100.60000000000001C479.5253837072019,100.60000000000001 479.5253837072019,99.60000000000001 496.19952774498233,99.60000000000001"
        from="tintin23_20" to="tintin23_21" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M496.19952774498233,99.60000000000001C509.9988193624558,99.60000000000001 509.9988193624558,123.45714285714287 523.7981109799292,123.45714285714287"
        from="tintin23_21" to="tintin23_23" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M523.7981109799292,123.45714285714287C547.9468713105077,123.45714285714287 547.9468713105077,131.70000000000002 572.0956316410862,131.70000000000002"
        from="tintin23_23" to="tintin23_24" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M572.0956316410862,131.70000000000002C578.9952774498229,131.70000000000002 578.9952774498229,134.88571428571427 585.8949232585596,134.88571428571427"
        from="tintin23_24" to="tintin23_25" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M585.8949232585596,134.88571428571427C599.1192443919717,134.88571428571427 599.1192443919717,99.60000000000001 612.3435655253837,99.60000000000001"
        from="tintin23_25" to="tintin23_26" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M612.3435655253837,99.60000000000001C614.6434474616293,99.60000000000001 614.6434474616293,99.60000000000001 616.9433293978749,99.60000000000001"
        from="tintin23_26" to="tintin23_28" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M616.9433293978749,99.60000000000001C639.3671782762692,99.60000000000001 639.3671782762692,112.02857142857144 661.7910271546635,112.02857142857144"
        from="tintin23_28" to="tintin23_29" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M661.7910271546635,112.02857142857144C728.4876033057851,112.02857142857144 728.4876033057851,120.80000000000001 795.1841794569068,120.80000000000001"
        from="tintin23_29" to="tintin23_33" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M795.1841794569068,120.80000000000001C833.7072018890201,120.80000000000001 833.7072018890201,118.30000000000001 872.2302243211335,118.30000000000001"
        from="tintin23_33" to="tintin23_35" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M872.2302243211335,118.30000000000001C875.6800472255018,118.30000000000001 875.6800472255018,118.30000000000001 879.1298701298701,118.30000000000001"
        from="tintin23_35" to="tintin23_36" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M879.1298701298701,118.30000000000001C880.2798110979929,118.30000000000001 880.2798110979929,122.31428571428573 881.4297520661157,122.31428571428573"
        from="tintin23_36" to="tintin23_37" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M881.4297520661157,122.31428571428573C911.9031877213696,122.31428571428573 911.9031877213696,100.2 942.3766233766235,100.2"
        from="tintin23_37" to="tintin23_39" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M942.3766233766235,100.2C946.4014167650532,100.2 946.4014167650532,114 950.4262101534829,114"
        from="tintin23_39" to="tintin23_40" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M950.4262101534829,114C954.4510035419127,114 954.4510035419127,98.42222222222225 958.4757969303424,98.42222222222225"
        from="tintin23_40" to="tintin23_41" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M958.4757969303424,98.42222222222225C964.8004722550177,98.42222222222225 964.8004722550177,125.74285714285715 971.125147579693,125.74285714285715"
        from="tintin23_41" to="tintin23_42" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M971.125147579693,125.74285714285715C976.2998819362456,125.74285714285715 976.2998819362456,94.30000000000001 981.4746162927981,94.30000000000001"
        from="tintin23_42" to="tintin23_43" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M116.7190082644628,96C131.09327036599765,96 131.09327036599765,96 145.4675324675325,96"
        from="tintin23_0" to="tintin23_2" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M145.4675324675325,96C156.96694214876035,96 156.96694214876035,121 168.4663518299882,121"
        from="tintin23_2" to="tintin23_3" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M168.4663518299882,121C199.51475796930345,121 199.51475796930345,96 230.56316410861868,96"
        from="tintin23_3" to="tintin23_4" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M230.56316410861868,96C247.23730814639907,96 247.23730814639907,126.10000000000001 263.9114521841795,126.10000000000001"
        from="tintin23_4" to="tintin23_7" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M263.9114521841795,126.10000000000001C335.20779220779224,126.10000000000001 335.20779220779224,98.10000000000001 406.504132231405,98.10000000000001"
        from="tintin23_7" to="tintin23_17" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M406.504132231405,98.10000000000001C420.8783943329398,98.10000000000001 420.8783943329398,101.8 435.25265643447466,101.8"
        from="tintin23_17" to="tintin23_19" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M435.25265643447466,101.8C449.0519480519481,101.8 449.0519480519481,104.4 462.8512396694215,104.4"
        from="tintin23_19" to="tintin23_20" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M462.8512396694215,104.4C479.5253837072019,104.4 479.5253837072019,103.4 496.19952774498233,103.4"
        from="tintin23_20" to="tintin23_21" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M496.19952774498233,103.4C509.9988193624558,103.4 509.9988193624558,127.25714285714287 523.7981109799292,127.25714285714287"
        from="tintin23_21" to="tintin23_23" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M523.7981109799292,127.25714285714287C547.9468713105077,127.25714285714287 547.9468713105077,135.50000000000003 572.0956316410862,135.50000000000003"
        from="tintin23_23" to="tintin23_24" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M572.0956316410862,135.50000000000003C578.9952774498229,135.50000000000003 578.9952774498229,138.68571428571428 585.8949232585596,138.68571428571428"
        from="tintin23_24" to="tintin23_25" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M585.8949232585596,138.68571428571428C599.1192443919717,138.68571428571428 599.1192443919717,103.4 612.3435655253837,103.4"
        from="tintin23_25" to="tintin23_26" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M612.3435655253837,103.4C614.6434474616293,103.4 614.6434474616293,103.4 616.9433293978749,103.4"
        from="tintin23_26" to="tintin23_28" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M616.9433293978749,103.4C639.3671782762692,103.4 639.3671782762692,115.82857142857144 661.7910271546635,115.82857142857144"
        from="tintin23_28" to="tintin23_29" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M661.7910271546635,115.82857142857144C728.4876033057851,115.82857142857144 728.4876033057851,124.60000000000001 795.1841794569068,124.60000000000001"
        from="tintin23_29" to="tintin23_33" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M795.1841794569068,124.60000000000001C876.8299881936246,124.60000000000001 876.8299881936246,102.22222222222224 958.4757969303424,102.22222222222224"
        from="tintin23_33" to="tintin23_41" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M958.4757969303424,102.22222222222224C969.9752066115702,102.22222222222224 969.9752066115702,98.10000000000001 981.4746162927981,98.10000000000001"
        from="tintin23_41" to="tintin23_43" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M116.7190082644628,99.8C131.09327036599765,99.8 131.09327036599765,99.8 145.4675324675325,99.8"
        from="tintin23_0" to="tintin23_2" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M145.4675324675325,99.8C156.96694214876035,99.8 156.96694214876035,124.8 168.4663518299882,124.8"
        from="tintin23_2" to="tintin23_3" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M168.4663518299882,124.8C199.51475796930345,124.8 199.51475796930345,99.8 230.56316410861868,99.8"
        from="tintin23_3" to="tintin23_4" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M230.56316410861868,99.8C239.76269185360098,99.8 239.76269185360098,138.66666666666669 248.96221959858326,138.66666666666669"
        from="tintin23_4" to="tintin23_5" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M248.96221959858326,138.66666666666669C250.11216056670605,138.66666666666669 250.11216056670605,101.33333333333333 251.26210153482882,101.33333333333333"
        from="tintin23_5" to="tintin23_6" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M251.26210153482882,101.33333333333333C257.58677685950414,101.33333333333333 257.58677685950414,129.9 263.9114521841795,129.9"
        from="tintin23_6" to="tintin23_7" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M263.9114521841795,129.9C271.3860684769776,129.9 271.3860684769776,108.2 278.8606847697757,108.2"
        from="tintin23_7" to="tintin23_8" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M278.8606847697757,108.2C293.2349468713105,108.2 293.2349468713105,108.2 307.60920897284535,108.2"
        from="tintin23_8" to="tintin23_9" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M307.60920897284535,108.2C309.90909090909093,108.2 309.90909090909093,136.3 312.2089728453365,136.3"
        from="tintin23_9" to="tintin23_10" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M312.2089728453365,136.3C323.133412042503,136.3 323.133412042503,104 334.05785123966945,104"
        from="tintin23_10" to="tintin23_12" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M334.05785123966945,104C337.50767414403776,104 337.50767414403776,104 340.95749704840614,104"
        from="tintin23_12" to="tintin23_13" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M340.95749704840614,104C347.2821723730815,104 347.2821723730815,145.53333333333336 353.6068476977568,145.53333333333336"
        from="tintin23_13" to="tintin23_15" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M353.6068476977568,145.53333333333336C374.305785123967,145.53333333333336 374.305785123967,166.1 395.0047225501771,166.1"
        from="tintin23_15" to="tintin23_16" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M395.0047225501771,166.1C400.7544273907911,166.1 400.7544273907911,101.9 406.504132231405,101.9"
        from="tintin23_16" to="tintin23_17" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M406.504132231405,101.9C420.8783943329398,101.9 420.8783943329398,105.6 435.25265643447466,105.6"
        from="tintin23_17" to="tintin23_19" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M435.25265643447466,105.6C449.0519480519481,105.6 449.0519480519481,108.2 462.8512396694215,108.2"
        from="tintin23_19" to="tintin23_20" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M462.8512396694215,108.2C479.5253837072019,108.2 479.5253837072019,107.2 496.19952774498233,107.2"
        from="tintin23_20" to="tintin23_21" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M496.19952774498233,107.2C509.9988193624558,107.2 509.9988193624558,131.05714285714288 523.7981109799292,131.05714285714288"
        from="tintin23_21" to="tintin23_23" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M523.7981109799292,131.05714285714288C547.9468713105077,131.05714285714288 547.9468713105077,139.3 572.0956316410862,139.3"
        from="tintin23_23" to="tintin23_24" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M572.0956316410862,139.3C578.9952774498229,139.3 578.9952774498229,142.48571428571427 585.8949232585596,142.48571428571427"
        from="tintin23_24" to="tintin23_25" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M585.8949232585596,142.48571428571427C599.1192443919717,142.48571428571427 599.1192443919717,107.2 612.3435655253837,107.2"
        from="tintin23_25" to="tintin23_26" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M612.3435655253837,107.2C614.6434474616293,107.2 614.6434474616293,107.2 616.9433293978749,107.2"
        from="tintin23_26" to="tintin23_28" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M616.9433293978749,107.2C639.3671782762692,107.2 639.3671782762692,119.62857142857143 661.7910271546635,119.62857142857143"
        from="tintin23_28" to="tintin23_29" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M661.7910271546635,119.62857142857143C728.4876033057851,119.62857142857143 728.4876033057851,128.4 795.1841794569068,128.4"
        from="tintin23_29" to="tintin23_33" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M795.1841794569068,128.4C833.7072018890201,128.4 833.7072018890201,122.10000000000001 872.2302243211335,122.10000000000001"
        from="tintin23_33" to="tintin23_35" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M872.2302243211335,122.10000000000001C875.6800472255018,122.10000000000001 875.6800472255018,122.10000000000001 879.1298701298701,122.10000000000001"
        from="tintin23_35" to="tintin23_36" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M879.1298701298701,122.10000000000001C880.2798110979929,122.10000000000001 880.2798110979929,126.11428571428573 881.4297520661157,126.11428571428573"
        from="tintin23_36" to="tintin23_37" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M881.4297520661157,126.11428571428573C911.9031877213696,126.11428571428573 911.9031877213696,104 942.3766233766235,104"
        from="tintin23_37" to="tintin23_39" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M942.3766233766235,104C946.4014167650532,104 946.4014167650532,117.8 950.4262101534829,117.8"
        from="tintin23_39" to="tintin23_40" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M950.4262101534829,117.8C954.4510035419127,117.8 954.4510035419127,106.02222222222224 958.4757969303424,106.02222222222224"
        from="tintin23_40" to="tintin23_41" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M958.4757969303424,106.02222222222224C964.8004722550177,106.02222222222224 964.8004722550177,129.54285714285714 971.125147579693,129.54285714285714"
        from="tintin23_41" to="tintin23_42" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M971.125147579693,129.54285714285714C976.2998819362456,129.54285714285714 976.2998819362456,101.9 981.4746162927981,101.9"
        from="tintin23_42" to="tintin23_43" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M140.86776859504133,32.4C461.1263282172373,32.4 461.1263282172373,24 781.3848878394333,24"
        from="tintin23_1" to="tintin23_31" charid="tintin23_3" class="link" style="stroke: rgb(36, 133, 36); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M781.3848878394333,24C785.4096812278631,24 785.4096812278631,24 789.4344746162928,24"
        from="tintin23_31" to="tintin23_32" charid="tintin23_3" class="link" style="stroke: rgb(36, 133, 36); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M789.4344746162928,24C873.9551357733176,24 873.9551357733176,87.02222222222224 958.4757969303424,87.02222222222224"
        from="tintin23_32" to="tintin23_41" charid="tintin23_3" class="link" style="stroke: rgb(36, 133, 36); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M140.86776859504133,36.199999999999996C549.6717827626919,36.199999999999996 549.6717827626919,90.82222222222224 958.4757969303424,90.82222222222224"
        from="tintin23_1" to="tintin23_41" charid="tintin23_4" class="link" style="stroke: rgb(36, 133, 36); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M140.86776859504133,40C549.6717827626919,40 549.6717827626919,94.62222222222223 958.4757969303424,94.62222222222223"
        from="tintin23_1" to="tintin23_41" charid="tintin23_5" class="link" style="stroke: rgb(36, 133, 36); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M140.86776859504133,43.8C459.4014167650531,43.8 459.4014167650531,242.1 777.9350649350649,242.1"
        from="tintin23_1" to="tintin23_30" charid="tintin23_6" class="link" style="stroke: rgb(179, 32, 33); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M777.9350649350649,242.1C858.43093270366,242.1 858.43093270366,242.1 938.9268004722551,242.1"
        from="tintin23_30" to="tintin23_38" charid="tintin23_6" class="link" style="stroke: rgb(179, 32, 33); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M938.9268004722551,242.1C944.676505312869,242.1 944.676505312869,125.4 950.4262101534829,125.4"
        from="tintin23_38" to="tintin23_40" charid="tintin23_6" class="link" style="stroke: rgb(179, 32, 33); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M950.4262101534829,125.4C954.4510035419127,125.4 954.4510035419127,113.62222222222223 958.4757969303424,113.62222222222223"
        from="tintin23_40" to="tintin23_41" charid="tintin23_6" class="link" style="stroke: rgb(179, 32, 33); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M140.86776859504133,47.6C459.4014167650531,47.6 459.4014167650531,245.9 777.9350649350649,245.9"
        from="tintin23_1" to="tintin23_30" charid="tintin23_7" class="link" style="stroke: rgb(179, 32, 33); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M777.9350649350649,245.9C858.43093270366,245.9 858.43093270366,245.9 938.9268004722551,245.9"
        from="tintin23_30" to="tintin23_38" charid="tintin23_7" class="link" style="stroke: rgb(179, 32, 33); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M938.9268004722551,245.9C944.676505312869,245.9 944.676505312869,129.2 950.4262101534829,129.2"
        from="tintin23_38" to="tintin23_40" charid="tintin23_7" class="link" style="stroke: rgb(179, 32, 33); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M950.4262101534829,129.2C954.4510035419127,129.2 954.4510035419127,117.42222222222225 958.4757969303424,117.42222222222225"
        from="tintin23_40" to="tintin23_41" charid="tintin23_7" class="link" style="stroke: rgb(179, 32, 33); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M168.4663518299882,128.6C209.8642266824085,128.6 209.8642266824085,105.13333333333333 251.26210153482882,105.13333333333333"
        from="tintin23_3" to="tintin23_6" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M251.26210153482882,105.13333333333333C265.06139315230223,105.13333333333333 265.06139315230223,112 278.8606847697757,112"
        from="tintin23_6" to="tintin23_8" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M278.8606847697757,112C293.2349468713105,112 293.2349468713105,112 307.60920897284535,112"
        from="tintin23_8" to="tintin23_9" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M307.60920897284535,112C309.90909090909093,112 309.90909090909093,140.10000000000002 312.2089728453365,140.10000000000002"
        from="tintin23_9" to="tintin23_10" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M312.2089728453365,140.10000000000002C332.90791027154665,140.10000000000002 332.90791027154665,149.33333333333337 353.6068476977568,149.33333333333337"
        from="tintin23_10" to="tintin23_15" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M353.6068476977568,149.33333333333337C380.0554899645809,149.33333333333337 380.0554899645809,105.70000000000002 406.504132231405,105.70000000000002"
        from="tintin23_15" to="tintin23_17" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M406.504132231405,105.70000000000002C420.8783943329398,105.70000000000002 420.8783943329398,109.4 435.25265643447466,109.4"
        from="tintin23_17" to="tintin23_19" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M435.25265643447466,109.4C449.0519480519481,109.4 449.0519480519481,112 462.8512396694215,112"
        from="tintin23_19" to="tintin23_20" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M462.8512396694215,112C479.5253837072019,112 479.5253837072019,111 496.19952774498233,111"
        from="tintin23_20" to="tintin23_21" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M496.19952774498233,111C509.9988193624558,111 509.9988193624558,134.85714285714286 523.7981109799292,134.85714285714286"
        from="tintin23_21" to="tintin23_23" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M523.7981109799292,134.85714285714286C547.9468713105077,134.85714285714286 547.9468713105077,143.10000000000002 572.0956316410862,143.10000000000002"
        from="tintin23_23" to="tintin23_24" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M572.0956316410862,143.10000000000002C578.9952774498229,143.10000000000002 578.9952774498229,146.28571428571428 585.8949232585596,146.28571428571428"
        from="tintin23_24" to="tintin23_25" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M585.8949232585596,146.28571428571428C599.1192443919717,146.28571428571428 599.1192443919717,111 612.3435655253837,111"
        from="tintin23_25" to="tintin23_26" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M612.3435655253837,111C614.6434474616293,111 614.6434474616293,111 616.9433293978749,111"
        from="tintin23_26" to="tintin23_28" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M616.9433293978749,111C639.3671782762692,111 639.3671782762692,123.42857142857144 661.7910271546635,123.42857142857144"
        from="tintin23_28" to="tintin23_29" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M661.7910271546635,123.42857142857144C728.4876033057851,123.42857142857144 728.4876033057851,132.20000000000002 795.1841794569068,132.20000000000002"
        from="tintin23_29" to="tintin23_33" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M795.1841794569068,132.20000000000002C829.1074380165289,132.20000000000002 829.1074380165289,260.2 863.0306965761512,260.2"
        from="tintin23_33" to="tintin23_34" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M863.0306965761512,260.2C917.077922077922,260.2 917.077922077922,133.34285714285716 971.125147579693,133.34285714285716"
        from="tintin23_34" to="tintin23_42" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M971.125147579693,133.34285714285716C976.2998819362456,133.34285714285716 976.2998819362456,105.70000000000002 981.4746162927981,105.70000000000002"
        from="tintin23_42" to="tintin23_43" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M168.4663518299882,132.4C208.71428571428572,132.4 208.71428571428572,142.46666666666667 248.96221959858326,142.46666666666667"
        from="tintin23_3" to="tintin23_5" charid="tintin23_10" class="link" style="stroke: rgb(25, 99, 150); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M248.96221959858326,142.46666666666667C256.4368358913814,142.46666666666667 256.4368358913814,133.70000000000002 263.9114521841795,133.70000000000002"
        from="tintin23_5" to="tintin23_7" charid="tintin23_10" class="link" style="stroke: rgb(25, 99, 150); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M278.8606847697757,115.8C293.2349468713105,115.8 293.2349468713105,115.8 307.60920897284535,115.8"
        from="tintin23_8" to="tintin23_9" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M307.60920897284535,115.8C309.90909090909093,115.8 309.90909090909093,143.9 312.2089728453365,143.9"
        from="tintin23_9" to="tintin23_10" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M312.2089728453365,143.9C320.258559622196,143.9 320.258559622196,282.09999999999997 328.3081463990555,282.09999999999997"
        from="tintin23_10" to="tintin23_11" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M328.3081463990555,282.09999999999997C336.93270365997637,282.09999999999997 336.93270365997637,282.09999999999997 345.5572609208973,282.09999999999997"
        from="tintin23_11" to="tintin23_14" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M345.5572609208973,282.09999999999997C386.9551357733176,282.09999999999997 386.9551357733176,282.09999999999997 428.3530106257379,282.09999999999997"
        from="tintin23_14" to="tintin23_18" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M428.3530106257379,282.09999999999997C445.6021251475797,282.09999999999997 445.6021251475797,115.80000000000001 462.8512396694215,115.80000000000001"
        from="tintin23_18" to="tintin23_20" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M462.8512396694215,115.80000000000001C491.02479338842977,115.80000000000001 491.02479338842977,122.10000000000001 519.198347107438,122.10000000000001"
        from="tintin23_20" to="tintin23_22" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M519.198347107438,122.10000000000001C566.9208972845337,122.10000000000001 566.9208972845337,282.09999999999997 614.6434474616293,282.09999999999997"
        from="tintin23_22" to="tintin23_27" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M614.6434474616293,282.09999999999997C748.0365997638726,282.09999999999997 748.0365997638726,129.91428571428574 881.4297520661157,129.91428571428574"
        from="tintin23_27" to="tintin23_37" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M881.4297520661157,129.91428571428574C911.9031877213696,129.91428571428574 911.9031877213696,107.8 942.3766233766235,107.8"
        from="tintin23_37" to="tintin23_39" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M942.3766233766235,107.8C946.4014167650532,107.8 946.4014167650532,121.6 950.4262101534829,121.6"
        from="tintin23_39" to="tintin23_40" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M950.4262101534829,121.6C954.4510035419127,121.6 954.4510035419127,109.82222222222224 958.4757969303424,109.82222222222224"
        from="tintin23_40" to="tintin23_41" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M312.2089728453365,147.70000000000002C332.90791027154665,147.70000000000002 332.90791027154665,153.13333333333335 353.6068476977568,153.13333333333335"
        from="tintin23_10" to="tintin23_15" charid="tintin23_15" class="link" style="stroke: rgb(106, 106, 106); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M353.6068476977568,153.13333333333335C374.305785123967,153.13333333333335 374.305785123967,169.9 395.0047225501771,169.9"
        from="tintin23_15" to="tintin23_16" charid="tintin23_15" class="link" style="stroke: rgb(106, 106, 106); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M328.3081463990555,285.9C336.93270365997637,285.9 336.93270365997637,285.9 345.5572609208973,285.9"
        from="tintin23_11" to="tintin23_14" charid="tintin23_16" class="link" style="stroke: rgb(123, 86, 158); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M345.5572609208973,285.9C386.9551357733176,285.9 386.9551357733176,285.9 428.3530106257379,285.9"
        from="tintin23_14" to="tintin23_18" charid="tintin23_16" class="link" style="stroke: rgb(123, 86, 158); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M428.3530106257379,285.9C521.4982290436836,285.9 521.4982290436836,285.9 614.6434474616293,285.9"
        from="tintin23_18" to="tintin23_27" charid="tintin23_16" class="link" style="stroke: rgb(123, 86, 158); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M614.6434474616293,285.9C748.0365997638726,285.9 748.0365997638726,145.11428571428573 881.4297520661157,145.11428571428573"
        from="tintin23_27" to="tintin23_37" charid="tintin23_16" class="link" style="stroke: rgb(123, 86, 158); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M435.25265643447466,113.2C449.0519480519481,113.2 449.0519480519481,119.60000000000001 462.8512396694215,119.60000000000001"
        from="tintin23_19" to="tintin23_20" charid="tintin23_17" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M462.8512396694215,119.60000000000001C491.02479338842977,119.60000000000001 491.02479338842977,125.9 519.198347107438,125.9"
        from="tintin23_20" to="tintin23_22" charid="tintin23_17" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M519.198347107438,125.9C700.314049586777,125.9 700.314049586777,133.71428571428572 881.4297520661157,133.71428571428572"
        from="tintin23_22" to="tintin23_37" charid="tintin23_17" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M462.8512396694215,123.4C479.5253837072019,123.4 479.5253837072019,114.80000000000001 496.19952774498233,114.80000000000001"
        from="tintin23_20" to="tintin23_21" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M496.19952774498233,114.80000000000001C509.9988193624558,114.80000000000001 509.9988193624558,138.65714285714287 523.7981109799292,138.65714285714287"
        from="tintin23_21" to="tintin23_23" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M523.7981109799292,138.65714285714287C547.9468713105077,138.65714285714287 547.9468713105077,146.9 572.0956316410862,146.9"
        from="tintin23_23" to="tintin23_24" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M572.0956316410862,146.9C592.219598583235,146.9 592.219598583235,114.80000000000001 612.3435655253837,114.80000000000001"
        from="tintin23_24" to="tintin23_26" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M612.3435655253837,114.80000000000001C614.6434474616293,114.80000000000001 614.6434474616293,114.80000000000001 616.9433293978749,114.80000000000001"
        from="tintin23_26" to="tintin23_28" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M616.9433293978749,114.80000000000001C639.3671782762692,114.80000000000001 639.3671782762692,127.22857142857144 661.7910271546635,127.22857142857144"
        from="tintin23_28" to="tintin23_29" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M661.7910271546635,127.22857142857144C728.4876033057851,127.22857142857144 728.4876033057851,136 795.1841794569068,136"
        from="tintin23_29" to="tintin23_33" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M795.1841794569068,136C833.7072018890201,136 833.7072018890201,125.9 872.2302243211335,125.9"
        from="tintin23_33" to="tintin23_35" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M872.2302243211335,125.9C875.6800472255018,125.9 875.6800472255018,125.9 879.1298701298701,125.9"
        from="tintin23_35" to="tintin23_36" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M879.1298701298701,125.9C880.2798110979929,125.9 880.2798110979929,137.51428571428573 881.4297520661157,137.51428571428573"
        from="tintin23_36" to="tintin23_37" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M881.4297520661157,137.51428571428573C926.2774498229044,137.51428571428573 926.2774498229044,137.14285714285714 971.125147579693,137.14285714285714"
        from="tintin23_37" to="tintin23_42" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M523.7981109799292,142.45714285714288C547.9468713105077,142.45714285714288 547.9468713105077,150.70000000000002 572.0956316410862,150.70000000000002"
        from="tintin23_23" to="tintin23_24" charid="tintin23_19" class="link" style="stroke: rgb(117, 71, 62); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M572.0956316410862,150.70000000000002C578.9952774498229,150.70000000000002 578.9952774498229,150.08571428571426 585.8949232585596,150.08571428571426"
        from="tintin23_24" to="tintin23_25" charid="tintin23_19" class="link" style="stroke: rgb(117, 71, 62); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M523.7981109799292,146.25714285714287C547.9468713105077,146.25714285714287 547.9468713105077,154.50000000000003 572.0956316410862,154.50000000000003"
        from="tintin23_23" to="tintin23_24" charid="tintin23_20" class="link" style="stroke: rgb(117, 71, 62); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M572.0956316410862,154.50000000000003C578.9952774498229,154.50000000000003 578.9952774498229,153.88571428571427 585.8949232585596,153.88571428571427"
        from="tintin23_24" to="tintin23_25" charid="tintin23_20" class="link" style="stroke: rgb(117, 71, 62); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M572.0956316410862,158.3C578.9952774498229,158.3 578.9952774498229,157.68571428571428 585.8949232585596,157.68571428571428"
        from="tintin23_24" to="tintin23_25" charid="tintin23_21" class="link" style="stroke: rgb(117, 71, 62); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M661.7910271546635,131.02857142857144C728.4876033057851,131.02857142857144 728.4876033057851,139.8 795.1841794569068,139.8"
        from="tintin23_29" to="tintin23_33" charid="tintin23_22" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M795.1841794569068,139.8C829.1074380165289,139.8 829.1074380165289,264 863.0306965761512,264"
        from="tintin23_33" to="tintin23_34" charid="tintin23_22" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M863.0306965761512,264C917.077922077922,264 917.077922077922,140.94285714285715 971.125147579693,140.94285714285715"
        from="tintin23_34" to="tintin23_42" charid="tintin23_22" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M661.7910271546635,134.82857142857145C728.4876033057851,134.82857142857145 728.4876033057851,143.6 795.1841794569068,143.6"
        from="tintin23_29" to="tintin23_33" charid="tintin23_23" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M795.1841794569068,143.6C833.7072018890201,143.6 833.7072018890201,129.70000000000002 872.2302243211335,129.70000000000002"
        from="tintin23_33" to="tintin23_35" charid="tintin23_23" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M872.2302243211335,129.70000000000002C875.6800472255018,129.70000000000002 875.6800472255018,129.70000000000002 879.1298701298701,129.70000000000002"
        from="tintin23_35" to="tintin23_36" charid="tintin23_23" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M879.1298701298701,129.70000000000002C880.2798110979929,129.70000000000002 880.2798110979929,141.31428571428572 881.4297520661157,141.31428571428572"
        from="tintin23_36" to="tintin23_37" charid="tintin23_23" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M795.1841794569068,147.4C883.1546635182999,147.4 883.1546635182999,144.74285714285716 971.125147579693,144.74285714285716"
        from="tintin23_33" to="tintin23_42" charid="tintin23_24" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M795.1841794569068,151.20000000000002C829.1074380165289,151.20000000000002 829.1074380165289,267.8 863.0306965761512,267.8"
        from="tintin23_33" to="tintin23_34" charid="tintin23_25" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M863.0306965761512,267.8C917.077922077922,267.8 917.077922077922,148.54285714285714 971.125147579693,148.54285714285714"
        from="tintin23_34" to="tintin23_42" charid="tintin23_25" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,88.9C112.10655253837072,88.9 112.10655253837072,92.2 116.7190082644628,92.2"
        from="tintin23_44" to="tintin23_0" charid="tintin23_0" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,96.9C112.10655253837072,96.9 112.10655253837072,96 116.7190082644628,96"
        from="tintin23_45" to="tintin23_0" charid="tintin23_1" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,104.9C112.10655253837072,104.9 112.10655253837072,99.8 116.7190082644628,99.8"
        from="tintin23_46" to="tintin23_0" charid="tintin23_2" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,24.9C124.18093270365998,24.9 124.18093270365998,32.4 140.86776859504133,32.4"
        from="tintin23_47" to="tintin23_1" charid="tintin23_3" class="link" style="stroke: rgb(36, 133, 36); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,32.9C124.18093270365998,32.9 124.18093270365998,36.199999999999996 140.86776859504133,36.199999999999996"
        from="tintin23_48" to="tintin23_1" charid="tintin23_4" class="link" style="stroke: rgb(36, 133, 36); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,40.9C124.18093270365998,40.9 124.18093270365998,40 140.86776859504133,40"
        from="tintin23_49" to="tintin23_1" charid="tintin23_5" class="link" style="stroke: rgb(36, 133, 36); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,48.9C124.18093270365998,48.9 124.18093270365998,43.8 140.86776859504133,43.8"
        from="tintin23_50" to="tintin23_1" charid="tintin23_6" class="link" style="stroke: rgb(179, 32, 33); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,56.9C124.18093270365998,56.9 124.18093270365998,47.6 140.86776859504133,47.6"
        from="tintin23_51" to="tintin23_1" charid="tintin23_7" class="link" style="stroke: rgb(179, 32, 33); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,112.9C137.98022432113342,112.9 137.98022432113342,128.6 168.4663518299882,128.6"
        from="tintin23_52" to="tintin23_3" charid="tintin23_9" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,224.9C137.98022432113342,224.9 137.98022432113342,132.4 168.4663518299882,132.4"
        from="tintin23_53" to="tintin23_3" charid="tintin23_10" class="link" style="stroke: rgb(25, 99, 150); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M107.49409681227863,120.9C193.17739079102716,120.9 193.17739079102716,115.8 278.8606847697757,115.8"
        from="tintin23_54" to="tintin23_8" charid="tintin23_14" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M302.98406139315233,142.9C307.5965171192444,142.9 307.5965171192444,147.70000000000002 312.2089728453365,147.70000000000002"
        from="tintin23_55" to="tintin23_10" charid="tintin23_15" class="link" style="stroke: rgb(106, 106, 106); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M319.0832349468713,284.9C323.6956906729634,284.9 323.6956906729634,285.9 328.3081463990555,285.9"
        from="tintin23_56" to="tintin23_11" charid="tintin23_16" class="link" style="stroke: rgb(123, 86, 158); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M426.02774498229047,106.5C430.64020070838257,106.5 430.64020070838257,113.2 435.25265643447466,113.2"
        from="tintin23_57" to="tintin23_19" charid="tintin23_17" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M453.6263282172373,112.9C458.2387839433294,112.9 458.2387839433294,123.4 462.8512396694215,123.4"
        from="tintin23_58" to="tintin23_20" charid="tintin23_18" class="link" style="stroke: rgb(213, 106, 11); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M514.573199527745,135.75714285714287C519.1856552538371,135.75714285714287 519.1856552538371,142.45714285714288 523.7981109799292,142.45714285714288"
        from="tintin23_59" to="tintin23_23" charid="tintin23_19" class="link" style="stroke: rgb(117, 71, 62); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M514.573199527745,143.75714285714287C519.1856552538371,143.75714285714287 519.1856552538371,146.25714285714287 523.7981109799292,146.25714285714287"
        from="tintin23_60" to="tintin23_23" charid="tintin23_20" class="link" style="stroke: rgb(117, 71, 62); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M562.870720188902,145.9C567.4831759149941,145.9 567.4831759149941,158.3 572.0956316410862,158.3"
        from="tintin23_61" to="tintin23_24" charid="tintin23_21" class="link" style="stroke: rgb(117, 71, 62); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M652.5661157024794,124.32857142857144C657.1785714285714,124.32857142857144 657.1785714285714,131.02857142857144 661.7910271546635,131.02857142857144"
        from="tintin23_62" to="tintin23_29" charid="tintin23_22" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M652.5661157024794,132.32857142857145C657.1785714285714,132.32857142857145 657.1785714285714,134.82857142857145 661.7910271546635,134.82857142857145"
        from="tintin23_63" to="tintin23_29" charid="tintin23_23" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M785.9592680047226,136.9C790.5717237308147,136.9 790.5717237308147,147.4 795.1841794569068,147.4"
        from="tintin23_64" to="tintin23_33" charid="tintin23_24" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
    <path d="M785.9592680047226,144.9C790.5717237308147,144.9 790.5717237308147,151.20000000000002 795.1841794569068,151.20000000000002"
        from="tintin23_65" to="tintin23_33" charid="tintin23_25" class="link" style="stroke: rgb(189, 99, 162); stroke-width: 1.8; stroke-opacity: 0.6; stroke-linecap: round; fill: none; opacity: 0;"></path>
</g>
<g data-v-7057edc8="">
    <g transform="translate(114.99409681227863,91.3)" scene_id="0" class="node">
        <rect width="3.449822904368359" height="9.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(139.14285714285714,31.5)" scene_id="1" class="node">
        <rect width="3.449822904368359" height="17" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(143.7426210153483,91.3)" scene_id="2" class="node">
        <rect width="3.449822904368359" height="9.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(166.74144037780403,116.3)" scene_id="3" class="node">
        <rect width="3.449822904368359" height="17" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(228.8382526564345,91.3)" scene_id="4" class="node">
        <rect width="3.449822904368359" height="9.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(247.23730814639907,133.96666666666667)" scene_id="5" class="node">
        <rect width="3.449822904368359" height="9.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(249.53719008264463,96.63333333333333)" scene_id="6" class="node">
        <rect width="3.449822904368359" height="9.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(262.1865407319953,121.4)" scene_id="7" class="node">
        <rect width="3.449822904368359" height="13.2" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(277.1357733175915,107.3)" scene_id="8" class="node">
        <rect width="3.449822904368359" height="9.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(305.88429752066116,107.3)" scene_id="9" class="node">
        <rect width="3.449822904368359" height="9.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(310.48406139315233,135.4)" scene_id="10" class="node">
        <rect width="3.449822904368359" height="13.2" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(326.5832349468713,281.2)" scene_id="11" class="node">
        <rect width="3.449822904368359" height="5.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(332.33293978748526,103.1)" scene_id="12" class="node">
        <rect width="3.449822904368359" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(339.23258559622195,103.1)" scene_id="13" class="node">
        <rect width="3.449822904368359" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(343.8323494687131,281.2)" scene_id="14" class="node">
        <rect width="3.449822904368359" height="5.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(351.8819362455726,144.63333333333335)" scene_id="15" class="node">
        <rect width="3.449822904368359" height="9.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(393.27981109799293,165.2)" scene_id="16" class="node">
        <rect width="3.449822904368359" height="5.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(404.7792207792208,93.4)" scene_id="17" class="node">
        <rect width="3.449822904368359" height="13.2" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(426.6280991735537,281.2)" scene_id="18" class="node">
        <rect width="3.449822904368359" height="5.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(433.52774498229047,97.1)" scene_id="19" class="node">
        <rect width="3.449822904368359" height="17" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(461.1263282172373,99.7)" scene_id="20" class="node">
        <rect width="3.449822904368359" height="24.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(494.47461629279815,98.7)" scene_id="21" class="node">
        <rect width="3.449822904368359" height="17" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(517.4734356552539,121.2)" scene_id="22" class="node">
        <rect width="3.449822904368359" height="5.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(522.073199527745,122.55714285714286)" scene_id="23" class="node">
        <rect width="3.449822904368359" height="24.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(570.370720188902,130.8)" scene_id="24" class="node">
        <rect width="3.449822904368359" height="28.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(584.1700118063754,133.98571428571427)" scene_id="25" class="node">
        <rect width="3.449822904368359" height="24.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(610.6186540731995,98.7)" scene_id="26" class="node">
        <rect width="3.449822904368359" height="17" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(612.9185360094451,281.2)" scene_id="27" class="node">
        <rect width="3.449822904368359" height="5.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(615.2184179456907,98.7)" scene_id="28" class="node">
        <rect width="3.449822904368359" height="17" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(660.0661157024794,111.12857142857143)" scene_id="29" class="node">
        <rect width="3.449822904368359" height="24.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(776.2101534828807,241.2)" scene_id="30" class="node">
        <rect width="3.449822904368359" height="5.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(779.6599763872491,23.1)" scene_id="31" class="node">
        <rect width="3.449822904368359" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(787.7095631641087,23.1)" scene_id="32" class="node">
        <rect width="3.449822904368359" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(793.4592680047226,119.9)" scene_id="33" class="node">
        <rect width="3.449822904368359" height="32.2" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(861.305785123967,259.3)" scene_id="34" class="node">
        <rect width="3.449822904368359" height="9.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(870.5053128689493,117.4)" scene_id="35" class="node">
        <rect width="3.449822904368359" height="13.2" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(877.404958677686,117.4)" scene_id="36" class="node">
        <rect width="3.449822904368359" height="13.2" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(879.7048406139315,121.41428571428573)" scene_id="37" class="node">
        <rect width="3.449822904368359" height="24.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(937.2018890200709,241.2)" scene_id="38" class="node">
        <rect width="3.449822904368359" height="5.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(940.6517119244393,99.3)" scene_id="39" class="node">
        <rect width="3.449822904368359" height="9.4" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(948.7012987012987,113.1)" scene_id="40" class="node">
        <rect width="3.449822904368359" height="17" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(956.7508854781582,86.12222222222223)" scene_id="41" class="node">
        <rect width="3.449822904368359" height="32.2" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(969.4002361275088,124.84285714285714)" scene_id="42" class="node">
        <rect width="3.449822904368359" height="24.6" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(979.749704840614,93.4)" scene_id="43" class="node">
        <rect width="3.449822904368359" height="13.2" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8=""></title>
        </rect>
        <rect style="opacity: 0;"></rect>
        <text style="font-size: 10px; font-family: sans-serif; opacity: 0;"></text>
    </g>
    <g transform="translate(104.99409681227863,88)" scene_id="44" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Tintin</title>
        </rect>
        <rect x="-40" y="-3" width="35" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Tintin</text>
    </g>
    <g transform="translate(104.99409681227863,96)" scene_id="45" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Snowy</title>
        </rect>
        <rect x="-35" y="-3" width="30" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Snowy</text>
    </g>
    <g transform="translate(104.99409681227863,104)" scene_id="46" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Captain Haddock</title>
        </rect>
        <rect x="-85" y="-3" width="80" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Captain Haddock</text>
    </g>
    <g transform="translate(104.99409681227863,24)" scene_id="47" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Bianca Castafiore</title>
        </rect>
        <rect x="-95" y="-3" width="90" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Bianca Castafiore</text>
    </g>
    <g transform="translate(104.99409681227863,32)" scene_id="48" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Irma</title>
        </rect>
        <rect x="-30" y="-3" width="25" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Irma</text>
    </g>
    <g transform="translate(104.99409681227863,40)" scene_id="49" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Igor Wagner</title>
        </rect>
        <rect x="-65" y="-3" width="60" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Igor Wagner</text>
    </g>
    <g transform="translate(104.99409681227863,48)" scene_id="50" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Thompson</title>
        </rect>
        <rect x="-50" y="-3" width="45" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Thompson</text>
    </g>
    <g transform="translate(104.99409681227863,56)" scene_id="51" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">And Thompson</title>
        </rect>
        <rect x="-70" y="-3" width="65" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">And Thompson</text>
    </g>
    <g transform="translate(104.99409681227863,112)" scene_id="52" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Professor Calculus</title>
        </rect>
        <rect x="-100" y="-3" width="95" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Professor Calculus</text>
    </g>
    <g transform="translate(104.99409681227863,224)" scene_id="53" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Nestor</title>
        </rect>
        <rect x="-40" y="-3" width="35" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Nestor</text>
    </g>
    <g transform="translate(104.99409681227863,120)" scene_id="54" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Colonel Alvarez</title>
        </rect>
        <rect x="-85" y="-3" width="80" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Colonel Alvarez</text>
    </g>
    <g transform="translate(300.48406139315233,142)" scene_id="55" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Manolo</title>
        </rect>
        <rect x="-40" y="-3" width="35" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Manolo</text>
    </g>
    <g transform="translate(316.5832349468713,284)" scene_id="56" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Colonel Esponja</title>
        </rect>
        <rect x="-85" y="-3" width="80" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Colonel Esponja</text>
    </g>
    <g transform="translate(423.52774498229047,105.6)" scene_id="57" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Pablo</title>
        </rect>
        <rect x="-35" y="-3" width="30" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Pablo</text>
    </g>
    <g transform="translate(451.1263282172373,112)" scene_id="58" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">General Alcazar</title>
        </rect>
        <rect x="-85" y="-3" width="80" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">General Alcazar</text>
    </g>
    <g transform="translate(512.073199527745,134.85714285714286)" scene_id="59" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Ridgewell</title>
        </rect>
        <rect x="-55" y="-3" width="50" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Ridgewell</text>
    </g>
    <g transform="translate(512.073199527745,142.85714285714286)" scene_id="60" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Arumbayans</title>
        </rect>
        <rect x="-60" y="-3" width="55" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Arumbayans</text>
    </g>
    <g transform="translate(560.370720188902,145)" scene_id="61" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Avakuki</title>
        </rect>
        <rect x="-45" y="-3" width="40" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Avakuki</text>
    </g>
    <g transform="translate(650.0661157024794,123.42857142857143)" scene_id="62" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Peggy</title>
        </rect>
        <rect x="-35" y="-3" width="30" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Peggy</text>
    </g>
    <g transform="translate(650.0661157024794,131.42857142857144)" scene_id="63" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">The Picaros</title>
        </rect>
        <rect x="-65" y="-3" width="60" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">The Picaros</text>
    </g>
    <g transform="translate(783.4592680047226,136)" scene_id="64" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Tourists</title>
        </rect>
        <rect x="-50" y="-3" width="45" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Tourists</text>
    </g>
    <g transform="translate(783.4592680047226,144)" scene_id="65" class="node">
        <rect width="5" height="1.8" rx="20" ry="10" class="scene" style="fill-opacity: 0.15; color: rgb(120, 120, 120); shape-rendering: auto; opacity: 0;">
            <title data-v-7057edc8="">Dr. Livingstone</title>
        </rect>
        <rect x="-85" y="-3" width="80" height="7.5" fill="#fff" style="opacity: 0;"></rect>
        <text x="-6" y="0" dy=".35em" text-anchor="end" style="font-size: 10px; font-family: sans-serif; opacity: 0;">Dr. Livingstone</text>
    </g>
</g>
<image x="568.7000323359327" y="-32.19999999999999" xmlns:xlink="http://www.w3.org/1999/xlink"
    xlink:href="http://csclub.uwaterloo.ca/~n2iskand/comics/narrative/tintin23_narrative/scene_images/scene33.png"
    id="scene33" width="224.75923566878984" height="152.10000000000002" class="scene-image" style="position: relative; opacity: 0;"></image>
</g>
`;

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
