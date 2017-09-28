import introJs from 'intro.js';
import * as color from "../../utils/color.js";
import {
    offset
} from "../../utils/common-utils.js";
import {
    opinionseer
} from "../../algorithm/opinionseer.js";
import {
    UPDATE_CHANNEL
} from '../../store';
import * as d3 from "d3";
import {
    mapState,
    mapActions
} from 'vuex';
let ngroup, groups, maxtimestamp, currenttime, lastgroup, tags;
let initalData, currentData, color_spaces = [],
    img;
let zoom_ratio, bgtag;

const defaultTemp = {
    name: 'point',
    parent: ['a vis'],
    children: [],
    selected: false,
    marks: [{
        name: 'point',
        removed: false,
        selected: false,
        channels: [ {
            name: 'position',
            selected: false,
            animations: ["fade-in", "grow"],
        }, {
            name: 'size',
            selected: false,
            animations: ["change-size"],
        }, {
            name: 'color',
            selected: false,
            animations: ["add-color"],
        }, {
            name: 'shape',
            selected: false,
            animations: [],
        }],
    }],
};

export default {
    data() {
        const tabs = ['overview', 'triangle', 'bar', 'ring', 'ring2', 'sankey'].map((d, i) => ({
            name: d,
            mask: i,
        }));

        return {
            tabs: tabs,
            activeTab: tabs[0],
            tempShow: false,
        };
    },
    props: ['src', 'width', 'height'],
    computed: {
        ...mapState({
            temps: 'temps',
            blocks: 'blocks',
        }),
    },
    methods: {
        ...mapActions({
            updateChannel: UPDATE_CHANNEL,
        }),
        deleteTab() {
            const index = this.tabs.indexOf(this.activeTab);
            this.tabs.splice(index, 1);
            this.blocks.splice(index, 1);
        },
        addTab() {
            const item = new Object();
            // item.name = this.blocks.length.toString();
            item.name = "" + this.tabs.length;
            this.tabs.push(item);
            this.activeTab = this.tabs[this.tabs.length - 1];
        },
        addBlock(temp) {
            this.tempShow = false;
            if (this.activeTab.name === 'overview') {
                return;
            }
            const block = JSON.parse(JSON.stringify(temp));
            const hasName = (name) => {
                for (const b of this.blocks) {
                    if (b.name === name) {
                        return true;
                    }
                }
                return false;
            };

            for (let i = 1;; ++i) {
                const name = block.name + (i === 1 ? '' : i);
                if (!hasName(name)) {
                    block.name = name;
                    break;
                }
            }
            block.mask = this.activeTab.mask;
            block.marks.forEach((mark) => {
                mark.parent = block;
                mark.channels.forEach((channel) => {
                    channel.animations = ["fade-in", "annotation", "fade-out"].map((name) => ({
                        'name': name,
                        'channel': channel.name,
                    }));
                    channel.parent = mark;
                });
                this.updateChannel(mark.channels);
            });
            this.blocks.push(block);
            this.activeTab.name = block.name;
        },
        figureTabClass(item) {
            return {
                "figure-tabs-item": true,
                "active": item == this.activeTab
            };
        },
        onTabClick(item) {
            this.activeTab = item;
            console.log(item);
            var figureContent = document.getElementsByClassName('figure-content')[0];
            opinionseer(d3.select(".figure-main-view"), figureContent.clientWidth, figureContent.clientHeight, item.mask);
        },
    },

    mounted() {
        var figureContent = document.getElementsByClassName('figure-content')[0];
        d3.select(".figure-main-view")
            .attr("width", figureContent.clientWidth)
            .attr("height", figureContent.clientHeight);
        opinionseer(d3.select(".figure-main-view"), figureContent.clientWidth, figureContent.clientHeight, 0);

        for (var i = 1; i < this.tabs.length; ++i) {
            const block = JSON.parse(JSON.stringify(defaultTemp));
            block.startStatus = [
                i > 1 ? {
					length: 1,
					position: 1,
                    hue: 1,
                    sat: 1,
                    size: 1,
                    opacity: 1,
                    part: 'innerCircle'
                } : {
                    isBackground: true,
                    part: 'innerCircle'
                },
                i > 2 ? {
                    length: 1,
					position: 1,
                    hue: 1,
                    sat: 1,
                    size: 1,
                    opacity: 1,
                    part: 'innerBar'
                } : {
                    isBackground: true,
                    part: 'innerBar'
                },
                i > 3 ? {
                    length: 1,
					position: 1,
                    hue: 1,
                    sat: 1,
                    size: 1,
                    opacity: 1,
                    part: 'innerRing'
                } : {
                    isBackground: true,
                    part: 'innerRing'
                },
                i > 4 ? {
                    length: 1,
					position: 1,
                    hue: 1,
                    sat: 1,
                    size: 1,
                    opacity: 1,
                    part: 'parallelLinks'
                } : {
                    isBackground: true,
                    part: 'parallelLinks'
                },
                i > 5 ? {
                    length: 1,
					position: 1,
                    hue: 1,
                    sat: 1,
                    size: 1,
                    opacity: 1,
                    part: 'outerRing'
                } : {
                    isBackground: true,
                    part: 'outerRing'
                },
            ];
            block.endStatus = [
                i >= 1 ? {
                    length: 1,
					position: 1,
                    hue: 1,
                    sat: 1,
                    size: 1,
                    opacity: 1,
                    part: 'innerCircle'
                } : {
                    isBackground: true,
                    part: 'innerCircle'
                },
                i >= 2 ? {
                    length: 1,
					position: 1,
                    hue: 1,
                    sat: 1,
                    size: 1,
                    opacity: 1,
                    part: 'innerBar'
                } : {
                    isBackground: true,
                    part: 'innerBar'
                },
                i >= 3 ? {
                    length: 1,
					position: 1,
                    hue: 1,
                    sat: 1,
                    size: 1,
                    opacity: 1,
                    part: 'innerRing'
                } : {
                    isBackground: true,
                    part: 'innerRing'
                },
                i >= 4 ? {
                    length: 1,
					position: 1,
                    hue: 1,
                    sat: 1,
                    size: 1,
                    opacity: 1,
                    part: 'parallelLinks'
                } : {
                    isBackground: true,
                    part: 'parallelLinks'
                },
                i >= 5 ? {
                    length: 1,
					position: 1,
                    hue: 1,
                    sat: 1,
                    size: 1,
                    opacity: 1,
                    part: 'outerRing'
                } : {
                    isBackground: true,
                    part: 'outerRing'
                },
            ];
            block.startStatus[i - 1] = {
                length: 0,
				position: 0,
                hue: 0,
                sat: 0,
                size: 0,
                opacity: 0.2
            };
            block.selected = true;
            this.blocks.push(block);
            block.name = this.tabs[i].name;

            block.marks.forEach((mark) => {
                mark.parent = block;
                mark.channels.forEach((channel) => {
                    channel.animations = channel.animations.map((name) => ({
                        'name': name,
                        'channel': channel.name,
                        'parent': channel,
                        'annotation': name == 'anno' ? {
                            text: 'Add text here',
                            x: 70,
                            y: 100,
                        } : null,
                    }));
                    channel.parent = block;
                });
                this.updateChannel(mark.channels);
            });
            block.selected = false;
        }
    }
};
