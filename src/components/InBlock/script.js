import * as d3 from 'd3';
import {
    UPDATE_CHANNEL,
    SELECT_CHANNEL,
} from '../../store';
import {
    mapGetters,
    mapState,
    mapActions
} from 'vuex';

var width, height;

const aniWidth = 80;
const channelMinWidth = 70;
const addButtonWidth = 25;
const duration = 300;
const channelMargin = {
    top: 35,
    bottom: 10,
    left: 20,
    right: 20
};
const aniMargin = {
    top: 30,
    bottom: 10,
    left: 7,
    right: 7
};
const animationTypes = {
    color: ["anno", "fade-in", "fade-out", "add-color", "high-light"],
    size: ["anno", "fade-in", "fade-out", "change-size", "high-light"],
    position: ["anno", "fade-in", "fade-out", "grow", "change-size", "high-light"],
    shape: [],
};
const animationColumnNum = 4;
const animationExpandedWidth = 170;

export default {
    mounted() {
        var figureContent = document.getElementsByClassName('slide-view')[0];
        d3.select(".slide-svg")
            .attr("width", figureContent.clientWidth)
            .attr("height", figureContent.clientHeight);
    },
    computed: {
        ...mapGetters({
            selectedBlock: 'selectedBlock',
            selectedAnimation: 'selectedAnimation',
        }),
        ...mapState({
            marksTemp: 'marksTemp',
            blocks: 'blocks',
        }),
        block() {
            return this.selectedBlock || this.blocks[0];
        },
    },
    methods: {
        ...mapActions({
            updateChannel: UPDATE_CHANNEL,
            selectChannel: SELECT_CHANNEL,
        }),
        calcLayout(root) {
            var x = channelMargin.left;
            const channels = root.marks[0].channels;

            if (channels[0].hasOwnProperty('x')) {
                for (var i = 0; i < channels.length; ++i)
                    if (channels[i].remove) {
                        channels.splice(i, 1);
                    }
                for (var channel of channels) {
                    for (var i = 0; i < channel.animations.length; ++i)
                        if (channel.animations[i].remove) {
                            channel.animations.splice(i, 1);
                        }
                }
                root.marks[0].channels.sort((a, b) => a.x - b.x);
                root.marks[0].channels.forEach((channel) =>
                    channel.animations.sort((a, b) => a.x - b.x)
                );
            }

            for (const channel of channels) {
                channel.x = x;
                channel.y = channelMargin.top;
                x += channelMargin.left / 2;
                for (const ani of channel.animations) {
                    ani.x = x - channel.x;
                    ani.y = aniMargin.top;
                    ani.width = aniWidth;
                    x += aniMargin.left + aniWidth;
                }
                channel.addButtonX = x - channel.x;
                x += addButtonWidth + aniMargin.left;
                if (channel.expanded) {
                    x += animationExpandedWidth;
                }
                if (x - channel.x < channelMinWidth) {
                    x = channel.x + channelMinWidth;
                }
                channel.width = x - channel.x;
                channel.height = this.channelHeight;
                x += channelMargin.right / 2;
            }
            this.bgrWidth = x;

            this.updateChannel(channels);
        }, 
        updateSlide(root) {
            const svg = d3.select(".slide-svg");
            const svgWidth = +svg.attr("width");
            const svgHeight = +svg.attr("height");
            const channelHeight = svgHeight - channelMargin.top - channelMargin.bottom;
            this.channelHeight = channelHeight;
            const aniHeight = channelHeight - aniMargin.top - aniMargin.bottom;
            this.aniHeight = aniHeight;
            var bgrHeight = svgHeight;
            this.bgrWidth = 0;
            var lastSelectedAnimation = null;
            var thisSlide = this;

            thisSlide.calcLayout(root);
            this.bgrWidth += 200;
            var bgrWidth = this.bgrWidth;
            svg.selectAll("*").remove();

            var currX = 0;
            const slide = svg.append("g")
                .attr("transform", `translate(${currX}, 0)`)
                .attr("class", "slide")
                .call(d3.drag()
                    .on("drag", function () {
                        currX += d3.event.dx;
                        if (currX > 0) currX = 0;
                        if (currX + bgrWidth < svgWidth) currX = svgWidth - bgrWidth;
                        d3.select(this).attr("transform", `translate(${currX},0)`);
                    }));

            slide.append("rect")
                .attr("width", bgrWidth)
                .attr("height", bgrHeight)
                .style("fill", "white");

            slide.append("text")
                .attr("class", "slide-name")
                .attr("transform", `translate(${10},${channelMargin.top - 10})`)
                .text(root.name)
                .attr("dx", 3)
                .attr("dy", -5)
                .style('font-family', 'Helvetica')
                .style('fill', 'var(--color-blue-light)');

            var channelEnter = slide.selectAll(".channel")
                .data(root.marks[0].channels).enter()
                .append("g")
                .attr("class", "channel");

            var channel = slide.selectAll(".channel")
                .data(root.marks[0].channels);

            const onChannelDrag = d3.drag()
                .on("start", function (d) {
                    d3.select(this.parentNode).select(".close-group").style("display", "none");
                    d3.select(this.parentNode).select(".open-group").style("display", "block");
                    d.expanded = false;
                    d.x0 = d.x;
                    d.ex0 = d3.event.x;
                    thisSlide.calcLayout(root);
                    const currChannel = d3.select(this.parentNode);
                    currChannel.select(".bgrect")
                        .transition().duration(duration)
                        .attr("width", function (d) {
                            return d.width;
                        });
                    channel.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                    animation.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                })
                .on("drag", function (d) {
                    d.x = (d3.event.x - d.ex0) + d.x0;
                    d3.select(this.parentNode).attr("transform", `translate(${d.x},${d.y})`);
                }).on("end", function (d) {
                    thisSlide.calcLayout(root);
                    channel.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                    animation.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                });

            drawChannel();

            var animationEnter = channel.selectAll(".animation")
                .data(d => d.animations).enter()
                .append("g")
                .attr("class", "animation");

            var animation = channel.selectAll(".animation")
                .data(d => d.animations);

            drawAnimation();

            const addAniGroup = channel.append("g")
                .attr("class", "add-button")
                .attr("transform", d => `translate(${d.addButtonX},${aniMargin.top})`);

            const addAniButton = addAniGroup.append("g")
                .attr("class", "button")
                .style('opacity', 0.6)
                .on("mouseenter", function (d) {
                    d3.select(this).style("opacity", 1);
                })
                .on("mouseout", function (d) {
                    d3.select(this).style("opacity", 0.7);
                })
                .on("click", function (d) {
                    onAddAnimationButtonClick(this, d);
                });

            addAniButton.append("rect")
                .attr("width", addButtonWidth)
                .attr("height", aniHeight)
                .attr("rx", 5)
                .attr("ry", 5)
                .style('stroke', 'none')
                .style('fill', '#bbd8e2')
                .style('opacity', 1);

            addAniButton.append("path")
                .attr("class", "open-group")
                .attr("d", `M${addButtonWidth * 0.25},${aniHeight * 0.5 - 20}L${addButtonWidth * 0.25},${aniHeight * 0.5 + 20}L${addButtonWidth * 0.75},${aniHeight * 0.5}Z`)
                .style('stroke', 'none')
                .style("fill", "var(--color-blue-light)")
                .style('opacity', 1)
                .style('display', 'block')
                .on("mouseenter", function (d) {
                    d3.select(this.parentNode).style("opacity", 1);
                });

            const closeGroup = addAniGroup.append("g")
                .attr("class", "close-group")
                .style('display', 'none');

            const addAni = closeGroup.selectAll(".addanimation")
                .data(d => animationTypes[d.name].map(a => ({
                        animation: a,
                        channel: d,
                    }))
                ).enter()
                .append("g")
                .attr("class", "addanimation")
                .attr("transform", "translate(0, 0) scale(0.5)")
                .style('opacity', 0.7)
                .on("click", onAddAnimationItemClick);

            addAni.append("rect")
                .attr("width", aniWidth)
                .attr("height", aniHeight)
                .attr("rx", 10)
                .attr("ry", 10)
                .style("stroke", "none")
                .style('fill', '#5EA3BA')
                .on("mouseenter", function () {
                    d3.select(this.parentNode).style("opacity", 1);
                    d3.select(this)
                        .style("stroke", "#264C58")
                        .style("stroke-width", 4)
                })
                .on("mouseout", function () {
                    d3.select(this.parentNode).style("opacity", 0.7);
                    d3.select(this).style("stroke", "none");
                });

            addAni.selectAll(".name")
                .data(function (d) {
                    return d.animation.split('-').map(
                        s => [s, d.animation.split('-').length]
                    );
                }).enter()
                .append("text")
                .attr("class", "name")
                .text(d => d[0])
                .attr("dx", d => 40)
                .attr("dy", (d, i) => aniHeight * 0.6 + 5 - (d[1] - 1) * 10 + i * 20)
                .style('fill', '#f7fbfe')
                .attr('text-anchor', 'middle')
                .style('font-size', '22px')
                .style('font-family', 'Helvetica')
                .on("mouseenter", function () {
                    d3.select(this.parentNode).style("opacity", 1);
                    d3.select(this.parentNode).select("rect")
                        .style("stroke", "#264C58")
                        .style("stroke-width", 4)
                });

            closeGroup
                .append("path")
                .attr("d", `M${addButtonWidth * 0.75},${aniHeight * 0.5 - 20}L${addButtonWidth * 0.75},${aniHeight * 0.5 + 20}L${addButtonWidth * 0.25},${aniHeight * 0.5}Z`)
                .style('stroke', 'none')
                .style("fill", "var(--color-blue-light)")
                .style('opacity', 1)
                .on("mouseenter", function () {
                    d3.select(this.parentNode.parentNode).select(".button").style("opacity", 1);
                })
                .on("click", function (d) {
                    onAddAnimationButtonClick(this.parentNode, d);
                });

            function drawAnimation() {
                animation.attr("transform", d => `translate(${d.x},${d.y})`)
                    .style('opacity', d => d.selected ? 1 : 0.6)
                    .on("mouseenter", function (d) {
                        d3.select(this).style("opacity", 1);
                        d3.select(this).select(".close")
                            .transition().duration(duration)
                            .style("opacity", 1);
                    })
                    .on("mouseout", function (d) {
                        d3.select(this).select(".close")
                            .transition().duration(duration)
                            .style("opacity", 0);
                        if (d.selected) {
                            return;
                        }
                        d3.select(this).style("opacity", 0.6);
                    })
                    .call(d3.drag()
                        .on("start", function (d) {
                            d.x0 = d.x;
                        })
                        .on("drag", function (d) {
                            d.x += d3.event.dx;
                            if (d.x < 0) d.x = 0;
                            if (d.x + d.width > svgWidth) d.x = svgWidth - d.width;
                            d3.select(this).attr("transform", `translate(${d.x},${d.y})`);
                        }).on("end", function (d) {
                            if (Math.abs(d.x - d.x0) < 5) {
                                if (!d.selected) {
                                    if (lastSelectedAnimation != null) {
                                        lastSelectedAnimation.style("opacity", 0.6);
                                        lastSelectedAnimation.select("rect").style("stroke", "none");
                                        if (thisSlide.selectedAnimation) 
                                            thisSlide.selectedAnimation.selected = false;
                                    }
                                    d.selected = true;
                                    lastSelectedAnimation = d3.select(this);
                                    lastSelectedAnimation.select("rect").style("stroke", "#5EA3BA");
                                }
                                else {
                                    d.selected = false;
                                    lastSelectedAnimation = null;
                                }
                            }
                            thisSlide.calcLayout(root);
                            channel.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                            animation.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                        }));

                animation.selectAll("*").remove();

                animation.append("rect")
                    .attr("width", aniWidth)
                    .attr("height", aniHeight)
                    .attr("rx", 10)
                    .attr("ry", 10)
                    .style("stroke", function (d) {
                        if (d.selected) {
                            lastSelectedAnimation = d3.select(this.parentNode);
                        }
                        return d.selected ? '#5EA3BA' : "none";
                    })
                    .style("stroke-width", 2)
                    .style('fill', 'var(--color-blue-light)');

                animation.append('text')
                    .attr("class", "close")
                    .text(d => "\uf00d")
                    .attr('font-family', 'FontAwesome')
                    .attr("dx", aniWidth - 20)
                    .attr("dy", 20)
                    .style("fill", "#f7fbfe")
                    .style("opacity", 0)
                    .on("mouseenter", function () {
                        d3.select(this.parentNode).style("opacity", 1);
                        d3.select(this)
                            .transition().duration(duration)
                            .style("opacity", 1);
                    })
                    .on("click", function (d) {
                        d.remove = true;
                        thisSlide.calcLayout(root);

                        const currChannel = d3.select(this.parentNode.parentNode);
                        currChannel.select(".bgrect")
                            .transition().duration(duration)
                            .attr("width", function (d) {
                                return d.width;
                            });
                        currChannel.select(".add-button")
                            .transition().duration(duration)
                            .attr("transform", d => `translate(${d.addButtonX},${aniMargin.top})`);
                        channel.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                        d3.select(this.parentNode).remove();
                        animation.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                    });

                animation.selectAll(".name")
                    .data(function (d) {
                        return d.name.split('-').map(
                            s => [s, d.name.split('-').length]
                        );
                    }).enter()
                    .append("text")
                    .attr("class", "name")
                    .text(d => d[0])
                    .attr("dx", d => 40)
                    .attr("dy", (d, i) => aniHeight * 0.6 + 5 - (d[1] - 1) * 10 + i * 20)
                    .style('fill', '#f7fbfe')
                    .attr('text-anchor', 'middle')
                    .style('font-size', '22px')
                    .style('font-family', 'Helvetica')
                    .on("mouseenter", function () {
                        d3.select(this.parentNode).style("opacity", 1);
                    });
            }

            function drawChannel() {
                channel.append("rect")
                    .attr("class", "bgrect")
                    .attr("rx", 10)
                    .attr("ry", 10)
                    .attr("width", d => d.width)
                    .attr("height", d => d.height)
                    .attr("stroke-dasharray", "5,5")
                    .style('stroke', 'var(--color-blue-light)')
                    .style('stroke-width', '2')
                    .style('fill', '#f1f7f9')
                    .call(onChannelDrag);

                channel.append("text")
                    .text(d => d.name)
                    .attr("dx", 8)
                    .attr("dy", 20)
                    .style('font-family', 'Helvetica')
                    .style('fill', 'var(--color-blue-light)');

                channel
                    .attr("transform", d => `translate(${d.x},${d.y})`)
                    .style('opacity', 0.8)
                    .on("mouseenter", function () {
                        d3.select(this).style("opacity", 1);
                    })
                    .on("mouseout", function () {
                        d3.select(this).style("opacity", 0.8);
                    });
            }

            function onAddAnimationItemClick(d) {
                d.channel.animations.push({
                    name: d.animation,
                    channel: d.channel.name,
                    x: bgrWidth,
                    parent: d.channel,
                });
                thisSlide.calcLayout(root);
                channel = slide.selectAll(".channel").data(root.marks[0].channels);
                channel.select(".bgrect")
                    .transition().duration(duration)
                    .attr("width", function (d) {
                        return d.width;
                    });
                channel.select(".add-button")
                    .transition().duration(duration)
                    .attr("transform", d => `translate(${d.addButtonX},${aniMargin.top})`);

                animationEnter = channel.selectAll(".animation")
                    .data(d => d.animations).enter()
                    .append("g")
                    .attr("class", "animation");
                animation = channel.selectAll(".animation").data(d => d.animations);

                channel.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                drawAnimation();
            }

            function onAddAnimationButtonClick(self, d) {
                const aniGroup = d3.select(self.parentNode);
                const active = !aniGroup.classed("active");
                aniGroup.classed("active", active);
                aniGroup.select(".close-group").style("display", active ? "block" : "none");
                aniGroup.select(".open-group").style("display", active ? "none" : "block");
                if (active) {
                    aniGroup.selectAll(".addanimation")
                        .transition().duration(duration / 2)
                        .attr("transform", (d, i) => `scale(0.5) translate(
                            ${46 + (aniWidth + aniMargin.left) * (i % animationColumnNum)},
                            ${-20 + (aniHeight + aniMargin.bottom) * Math.floor(i / animationColumnNum)})`);
                    d.expanded = true;
                    thisSlide.calcLayout(root);
                    const currChannel = d3.select(self.parentNode.parentNode);
                    currChannel.select(".bgrect")
                        .transition().duration(duration)
                        .attr("width", function (d) {
                            return d.width;
                        });
                    channel.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                    animation.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                } else {
                    d.expanded = false;
                    thisSlide.calcLayout(root);
                    const currChannel = d3.select(self.parentNode.parentNode);
                    currChannel.select(".bgrect")
                        .transition().duration(duration)
                        .attr("width", function (d) {
                            return d.width;
                        });
                    channel.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                    animation.transition().duration(duration).attr("transform", d => `translate(${d.x},${d.y})`);
                }
            }
        },
    },
    watch: {
        selectedBlock(val) {
            this.selectedBlock = val;
            this.updateSlide(val);
        },
    },
};
