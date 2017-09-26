import * as d3 from "d3";

var filterCounter = 0;
export function opinionseer(svg, width, height, config = {
    parallelLinks: { isBackground: true },
    outerRing: { isBackground: true },
    innerRing : { isBackground: true },
    innerBar : { isBackground: true },
    innerCircle : { isBackground: true },
}) {
    function getNumberInNormalDistribution(mean, std_dev) {
        return mean + (randomNormalDistribution() * std_dev);
    }

    function randomNormalDistribution() {
        var u = 0.0,
            v = 0.0,
            w = 0.0,
            c = 0.0;
        do {
            u = Math.random() * 2 - 1.0;
            v = Math.random() * 2 - 1.0;
            w = u * u + v * v;
        } while (w == 0.0 || w >= 1.0)
        c = Math.sqrt((-2 * Math.log(w)) / w);
        return u * c;
    }
    var startTime = new Date().getTime();

    var width0 = 720;
    var height0 = 720;

    var generateData = false;
    var color1 = 'rgb(189,186,219)';
    var color2 = 'rgb(250,247,180)';
    var color3 = 'rgb(142,210,198)';
    var textColor = 'rgb(133,86,67)';
    var lightGrey = 'rgb(180,180,180)';
    var midGrey = 'rgb(146,146,146)'
    var grey = 'rgb(100,100,100)';
    var green = 'rgb(70,162,97)';
    var black = 'rgb(40,40,40)';
    var orange = 'rgb(223,124,63)';
    var fontColor = 'rgb(88,66,52)'
    var partitionNum = 50;

    var pointNum = 400;
    var points = [];

    var color = d3.scaleOrdinal([color1, color2, color3, d3.schemeCategory20c[2], d3.schemeCategory20c[6], d3.schemeCategory20c[
        10], d3.schemeCategory20c[14]]);
    var linkColor = [
        'rgb(242,202,215)', 'rgb(212,212,207)', 'rgb(175,120,165)', 'rgb(204,227,191)', 'rgb(249,235,126)',
        'rgb(143,203,187)',
        'rgb(250,245,183)', 'rgb(183,179,202)', 'rgb(226,122,112)', 'rgb(129,169,195)', 'rgb(238,172,107)',
        'rgb(172,207,115)'
    ];
    var typeNumber = 4;
    var typeNames = ["NONE", "1", "2", "3"];

    var outerElementNum = 8;
    var outerLables = ['None', 'USA', 'Canada', 'Australia', 'Singapore', 'India', 'Others', 'UK'];
    var outerElements = [0, 0.8, 0.1, 0.4, 0.3, 0.2, 0.4, 1.0];

    var innerCircleR = 120;
    var barH = 45;
    var innerRingR = 170;
    var innerRingH = 30;
    var outerRingR = 300;
    var outerRingH = 25;
    var outerRingMargin = 18;
    var startYear = 2008;
    var endYear = 2010;

    var yearNum = endYear - startYear + 1;
    var years = [];
    var calendarData = [];
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (var year = startYear; year <= endYear; ++year) {
        years.push(year);
    }

    if (generateData) {
        var monthData = [0.8, 0.2, 0.2, 0.6, 0.2, 0.2, 0.2, 0.2, 0.3, 0.3, 0.5, 1.0];

        for (var year = startYear; year <= endYear; ++year) {
            for (var d = 0; d < monthName.length; ++d) {
                calendarData.push([year, d, getNumberInNormalDistribution(monthData[d], monthData[d] * 0.33)]);
            }
        }
        console.log(JSON.stringify(calendarData));
    } else {
        calendarData = defaultCalendarData;
    }

    var cos30 = Math.cos(2 * Math.PI / monthName.length);
    var sin30 = Math.sin(2 * Math.PI / monthName.length);

    var calendarDataMin = Math.min(...calendarData.map(d => d[2]));
    var calendarDataMax = Math.max(...calendarData.map(d => d[2]));

    var calendarDataScale = d3.scaleLinear()
        .domain([calendarDataMin, calendarDataMax])
        .range(['white', 'grey']);

    var monthCount = [];
    for (var i = 0; i < monthName.length; ++i) {
        monthCount[i] = 0;
    }

    var totCount = 0;
    for (var i = 0; i < calendarData.length; ++i) {
        monthCount[calendarData[i][1]] += calendarData[i][2];
    }
    for (var i = 0; i < monthCount.length; ++i) {
        totCount += monthCount[i];
    }

    var totAngle = Math.PI * 2 / outerElementNum * 0.4;
    var linkedFrom = outerElements.indexOf('UK');
    var startAngle = Math.PI * 2 / outerElementNum * (linkedFrom + 0.5) - totAngle / 2;
    var endAngle = startAngle + totAngle;
    var leftLinks = [5, 6, 7, 8, 9, 10];
    var rightLinks = [4, 3, 2, 1, 0, 11];

    if (generateData) {
        for (var i = 0; i < pointNum; ++i) {
            var angle = getNumberInNormalDistribution(70, 14);
            if (angle > 180) angle = 180;
            if (angle < 0) angle = 0;
            if (Math.random() < 0.2) angle += 180;
            var r = Math.random() * (angle < 180 ? 1.4 : 1.1) * innerCircleR;
            if (r > innerCircleR) r = innerCircleR;
            if (r < 0) r = 0;
            var type = ~~Math.min(Math.random() * typeNumber, typeNumber - 1);
            points.push([angle % 360, r, type]);
        }
        console.log(JSON.stringify(points));
    } else {
        points = defaultPoints;
    }

    var aggregatedData = [];
    for (var i = 0; i < partitionNum; ++i) {
        aggregatedData[i] = [];
        for (var j = 0; j < typeNumber; ++j)
            aggregatedData[i].push(0);
    }

    var partition = d3.scaleLinear()
        .domain([0, 360])
        .range([0, partitionNum]);

    for (var point of points) {
        aggregatedData[~~partition(point[0])][point[2]]++;
    }
    for (var i = 0; i < partitionNum; ++i) {
        for (var j = 1; j < aggregatedData[i].length; ++j) {
            aggregatedData[i][j] += aggregatedData[i][j - 1];
        }
    }
    var barHeight = d3.scaleLinear()
        .domain([0, Math.max(...aggregatedData.map(d => d[d.length - 1]))])
        .range([0, barH]);

    var calcTime = new Date().getTime();

    // ===============================
    var paint = svg.select("g");
    if (paint.empty()) paint = svg.append("g");

    paint
        .attr("class", "graph")
        .attr("transform", `translate(${width / 2},${height / 2}) scale(${1.05 * Math.min(width, height) / Math.min(width0, height0)})`);

    if (typeof config === "number") {
        const code = config;
        config = {
            parallelLinks: code === 0 || code === 4 ? { length: 1, hue: 1, sat: 1, size: 1, opacity: 1 } : { isBackground: true },
            outerRing: code === 0 || code === 5 ? { length: 1, hue: 1, sat: 1, size: 1, opacity: 1 } : { isBackground: true },
            innerRing : code === 0 || code === 3 ? { length: 1, hue: 1, sat: 1, size: 1, opacity: 1 } : { isBackground: true },
            innerBar : code === 0 || code === 2 ? { length: 1, hue: 1, sat: 1, size: 1, opacity: 1 } : { isBackground: true },
            innerCircle : code === 0 || code === 1 ? { length: 1, hue: 1, sat: 1, size: 1, opacity: 1 } : { isBackground: true },
        }
    }

    if (config.parallelLinks) {
        if (config.parallelLinks.isBackground) {
            drawparallelLinks(1, 1, 1, 0, 0.1);
        } else {
            drawparallelLinks(config.parallelLinks.size,
                config.parallelLinks.length,
                config.parallelLinks.hue,
                config.parallelLinks.sat,
                config.parallelLinks.opacity);
        }
    }
    if (config.outerRing) {
        if (config.outerRing.isBackground) {
            drawOuterRing(1, 1, 1, 0, 0.1);
        } else {
            drawOuterRing(config.outerRing.size,
                config.outerRing.length,
                config.outerRing.hue,
                config.outerRing.sat,
                config.outerRing.opacity);
        }
    }
    if (config.innerRing) {
        if (config.innerRing.isBackground) {
            drawInnerRing(1, 1, 1, 0, 0.1);
        } else {
            drawInnerRing(config.innerRing.size,
                config.innerRing.length,
                config.innerRing.hue,
                config.innerRing.sat,
                config.innerRing.opacity);
        }
    }
    if (config.innerBar) {
        if (config.innerBar.isBackground) {
            drawInnerBar(1, 1, 1, 0, 0.1);
        } else {
            drawInnerBar(config.innerBar.size,
                config.innerBar.length,
                config.innerBar.hue,
                config.innerBar.sat,
                config.innerBar.opacity);
        }
    }
    if (config.innerCircle) {
        if (config.innerCircle.isBackground) {
            drawInnerCircle(1, 1, 1, 0, 0.1);
        } else {
            drawInnerCircle(config.innerCircle.size,
                config.innerCircle.length,
                config.innerCircle.hue,
                config.innerCircle.sat,
                config.innerCircle.opacity);
        }
    }

    function drawOuterRing(size, length, hue, sat, opacity) {
        if (hue !== 1 && length === 1) length = hue;

        paint.select(".outerRing").remove();
        var outerRing = paint.append("g")
            .attr("class", "outerRing");

        const grayFilter = svg.append("filter")
            .attr("id", `gray-filter${filterCounter}`);

        grayFilter.append("feColorMatrix")
            .attr('type', 'saturate')
            .attr('values', sat);
            
        outerRing
            .attr("opacity", opacity)
            .attr("transform", `scale(${size})`)
            .style('filter', `url(#gray-filter${filterCounter}`);
        filterCounter++;

        var leftNum = Math.floor(length * outerElements.length);
        var outerRings = outerRing
            .selectAll("ring")
            .data(outerElements.slice(0, leftNum + 1)).enter()
            .append("path")
            .attr("class", "ring");

        var sin45 = Math.sin(Math.PI * 2 / 8);
        var cos45 = Math.cos(Math.PI * 2 / 8);
        var outerColor = d3.scaleLinear().domain([0, 1]).range(['white', grey]);

        outerRings
            .attr("transform", (d, i) => `rotate(${i * 360 / 8})`)
            .attr("d", (d) => {
                var r0 = outerRingR;
                var r1 = outerRingR + outerRingH;
                var path =
                    `M ${0} ${-r0}
                    A ${r0} ${r0} 0 0 1 ${(sin45 * r0).toFixed(2)} ${(-cos45 * r0).toFixed(2)}
                    L ${(sin45 * r1).toFixed(2)} ${(-cos45 * r1).toFixed(2)}
                    A ${r1} ${r1} 0 0 0 ${0} ${-r1} Z`;
                return path;
            })
            .attr("fill", (d) => outerColor(d))
            .style("stroke-width", 3)
            .style("stroke", green)
            .style("opacity", (d, i) => i < leftNum ? 1 : length * outerElements.length - i);

        var outerRingLengeds = outerRing
            .selectAll("legend")
            .data(outerLables.slice(0, leftNum + 1)).enter()
            .append("text")
            .attr("class", "legend")
            .text((d) => d)
            .attr("dy", 5)
            .attr("transform", (d, i) => {
                var a = -(20 + i * 360 / outerLables.length) / 180 * Math.PI;
                var r = -(outerRingR + outerRingH + 15);
                return `translate(${r * Math.sin(a)}, ${r * Math.cos(a)})`;
            })
            .attr("fill", grey)
            .attr("text-anchor", "middle")
            .style("opacity", (d, i) => i < leftNum ? 1 : length * outerElements.length - i);
    }

    function drawInnerRing(size, length, hue, sat, opacity) {
        if (hue !== 1 && length === 1) length = hue;

        paint.select(".innerRing").remove();
        var innerRing = paint.append("g")
            .attr("class", "innerRing");

        const grayFilter = svg.append("filter")
            .attr("id", `gray-filter${filterCounter}`);

        grayFilter.append("feColorMatrix")
            .attr('type', 'saturate')
            .attr('values', sat);
            
        innerRing
            .attr("opacity", opacity)
            .attr("transform", `scale(${size})`)
            .style('filter', `url(#gray-filter${filterCounter}`);
        filterCounter++;

        var ringHeatMap = innerRing.append("g")
            .attr("class", "heatmap");

        var leftNum = Math.floor(length * calendarData.length);
        var rings = ringHeatMap.selectAll("ring")
            .data(calendarData.slice(0, leftNum + 1)).enter()
            .append("path")
            .attr("class", "ring")
            .attr("opacity", (d, i) => i < leftNum ? 1 : length * calendarData.length - leftNum);

        var ringLenged = innerRing.append("g")
            .attr("class", "ringLegend");

        var ringYearLengeds = ringLenged.selectAll("legend1")
            .data(years).enter()
            .append("text")
            .attr("class", "legend1")
            .text((d) => d)
            .attr("y", (d, i) => -(innerRingR + innerRingH / yearNum * i))
            .attr("fill", orange)
            .attr("font-size", "11px")
            .attr("text-anchor", "middle")
            .style("opacity", (d, i) => {
                const k = Math.floor(length * years.length);
                if (i < k) {
                    return 1;
                } else if (i === k) {
                    return length * years.length - k;
                } else {
                    return 0;
                }
            });

        var ringMonthLengeds = ringLenged.selectAll("legend2")
            .data(monthName).enter()
            .append("text")
            .attr("class", "legend2")
            .text((d) => d)
            .attr("transform", (d, i) => {
                var a = -(15 + i * 360 / monthName.length) / 180 * Math.PI;
                var r = -(innerRingR + innerRingH + 20);
                return `translate(${r * Math.sin(a)}, ${r * Math.cos(a)})`;
            })
            .attr("fill", grey)
            .attr("text-anchor", "middle")
            .style("opacity", (d, i) => {
                if (i < leftNum) {
                    return 1;
                } else if (i === leftNum) {
                    return length * years.length - leftNum;
                } else {
                    return 0;
                }
            });

        rings
            .attr("transform", (d) => `rotate(${d[1] * 360 / monthName.length})`)
            .attr("d", (d) => {
                var r0 = innerRingR + innerRingH / yearNum * (d[0] - startYear);
                var r1 = innerRingR + innerRingH / yearNum * (d[0] - startYear + 1);
                var path =
                    `M ${0} ${-r0}
                    A ${r0} ${r0} 0 0 1 ${(sin30 * r0).toFixed(2)} ${(-cos30 * r0).toFixed(2)}
                    L ${(sin30 * r1).toFixed(2)} ${(-cos30 * r1).toFixed(2)}
                    A ${r1} ${r1} 0 0 0 ${0} ${-r1} Z`;
                return path;
            })
            .attr("fill", (d) => calendarDataScale(d[2]))
            .style("stroke-width", 1)
            .style("stroke", green)
            .style("opacity", 0.9);
    }

    function drawparallelLinks(size, length, hue, sat, opacity) {
        if (hue !== 1 && length === 1) length = hue;

        paint.select(".parallelLinks").remove();
        var parallelLinks = paint.append("g")
            .attr("class", "parallelLinks");

        const grayFilter = svg.append("filter")
            .attr("id", `gray-filter${filterCounter}`);

        grayFilter.append("feColorMatrix")
            .attr('type', 'saturate')
            .attr('values', sat);
            
        parallelLinks
            .attr("opacity", opacity)
            .attr("transform", `scale(${size})`)
            .style('filter', `url(#gray-filter${filterCounter}`);
        filterCounter++;

        var leftNum = Math.floor(length * 12);
        for (var i = 0, margin = outerRingMargin, angle0 = startAngle; i < leftLinks.length; ++i) {
            var angle = monthCount[leftLinks[i]] / totCount * totAngle;
            var h = outerRingR * angle;
            var link = parallelLinks.append("g")
                .attr("class", "parallelLink")
                .attr("opacity", () => {
                    if (i < leftNum) {
                        return 1;
                    } else if (i === leftNum) {
                        return length * 12 - i;
                    } else return 0;
                });
            link.append("path")
                .attr("transform", `rotate(${angle0 * 360 / (Math.PI * 2)})`)
                .attr("d", (d) => {
                    var r0 = outerRingR - margin - h;
                    var r1 = outerRingR;
                    var sin0 = Math.sin(angle);
                    var cos0 = Math.cos(angle);
                    var path =
                        `M ${0} ${-r0}
                        A ${r0} ${r0} 0 0 1 ${sin0 * r0} ${-cos0 * r0}
                        L ${sin0 * r1} ${-cos0 * r1}
                        A ${r1} ${r1} 0 0 0 ${0} ${-r1} Z`;
                    return path;
                })
                .attr("fill", linkColor[leftLinks[i]])
                .style("stroke-width", 0)
                .style("opacity", 1);
            link.append("path")
                .attr("transform", `rotate(${angle0 * 360 / (Math.PI * 2)})`)
                .attr("d", (d) => {
                    var r0 = outerRingR - margin - h;
                    var r1 = outerRingR - margin;
                    var a = startAngle - angle0 + (leftLinks[i] + 1.5 + 0.05) / monthName.length * 2 * Math.PI;
                    var sin0 = Math.sin(a);
                    var cos0 = Math.cos(a);
                    var path =
                        `M ${0} ${-r0}
                        A ${r0} ${r0} 0 0 0 ${sin0 * r0} ${-cos0 * r0}
                        L ${sin0 * r1} ${-cos0 * r1}
                        A ${r1} ${r1} 0 0 1 ${0} ${-r1} Z`;
                    return path;
                })
                .attr("fill", linkColor[leftLinks[i]])
                .style("stroke-width", 0)
                .style("opacity", 1);
            link.append("path")
                .attr("transform", `rotate(${(leftLinks[i] + 0.5) * 360 / monthName.length})`)
                .attr("d", (d) => {
                    var r0 = innerRingR + innerRingH + 20;
                    var r1 = outerRingR - margin - h + 1;
                    var sin0 = Math.sin(angle);
                    var cos0 = Math.cos(angle);
                    var path =
                        `M ${0} ${-r0}
                            A ${r0} ${r0} 0 0 1 ${sin0 * r0} ${-cos0 * r0}
                            L ${sin0 * r1} ${-cos0 * r1}
                            A ${r1} ${r1} 0 0 0 ${0} ${-r1} Z`;
                    return path;
                })
                .attr("fill", linkColor[leftLinks[i]])
                .style("stroke-width", 0)
                .style("opacity", 1);
            angle0 += angle;
            margin += h;
        }

        for (var i = 0, margin = outerRingMargin, angle1 = endAngle; i < rightLinks.length; ++i) {
            var angle = monthCount[rightLinks[i]] / totCount * totAngle;
            var h = outerRingR * angle;
            var link = parallelLinks.append("g")
                .attr("class", "parallelLink")
                .attr("opacity", () => {
                    if (12 - i < leftNum) {
                        return 1;
                    } else if (12 - i === leftNum) {
                        return length * 12 - 12 + i;
                    } else return 0;
                });
            link.append("path")
                .attr("transform", `rotate(${(angle1 - angle) * 360 / (Math.PI * 2)})`)
                .attr("d", (d) => {
                    var r0 = outerRingR - margin - h;
                    var r1 = outerRingR;
                    var sin0 = Math.sin(angle);
                    var cos0 = Math.cos(angle);
                    var path =
                        `M ${0} ${-r0}
                        A ${r0} ${r0} 0 0 1 ${sin0 * r0} ${-cos0 * r0}
                        L ${sin0 * r1} ${-cos0 * r1}
                        A ${r1} ${r1} 0 0 0 ${0} ${-r1} Z`;
                    return path;
                })
                .attr("fill", linkColor[rightLinks[i]])
                .style("stroke-width", 0)
                .style("opacity", 1);
            link.append("path")
                .attr("transform", `rotate(${angle1 * 360 / (Math.PI * 2)})`)
                .attr("d", (d) => {
                    var r0 = outerRingR - margin - h;
                    var r1 = outerRingR - margin;
                    var a = endAngle - angle1 + (rightLinks[i] + 1 - 0.05) / monthName.length * 2 * Math.PI + angle;
                    var sin0 = Math.sin(a);
                    var cos0 = Math.cos(a);
                    var path =
                        `M ${0} ${-r0}
                        A ${r0} ${r0} 0 0 1 ${sin0 * r0} ${-cos0 * r0}
                        L ${sin0 * r1} ${-cos0 * r1}
                        A ${r1} ${r1} 0 0 0 ${0} ${-r1} Z`;
                    return path;
                })
                .attr("fill", linkColor[rightLinks[i]])
                .style("stroke-width", 0)
                .style("opacity", 1);
            link.append("path")
                .attr("transform", `rotate(${(rightLinks[i] + 0.5) * 360 / monthName.length})`)
                .attr("d", (d) => {
                    var r0 = innerRingR + innerRingH + 20;
                    var r1 = outerRingR - margin - h + 1;
                    var sin0 = Math.sin(angle);
                    var cos0 = Math.cos(angle);
                    var path =
                        `M ${0} ${-r0}
                            A ${r0} ${r0} 0 0 1 ${sin0 * r0} ${-cos0 * r0}
                            L ${sin0 * r1} ${-cos0 * r1}
                            A ${r1} ${r1} 0 0 0 ${0} ${-r1} Z`;
                    return path;
                })
                .attr("fill", linkColor[rightLinks[i]])
                .style("stroke-width", 0)
                .style("opacity", 1);
            angle1 -= angle;
            margin += h;
        }
    }

    function drawInnerCircle(size, length, hue, sat, opacity) {

        paint.select(".innerCircle").remove();
        var innerCircle = paint.append("g")
            .attr("class", "innerCircle");

        const grayFilter = svg.append("filter")
            .attr("id", `gray-filter${filterCounter}`);

        grayFilter.append("feColorMatrix")
            .attr('type', 'saturate')
            .attr('values', sat);
            
        innerCircle
            .attr("opacity", opacity)
            .attr("transform", `scale(${size})`)
            .style('filter', `url(#gray-filter${filterCounter}`);
        filterCounter++;

        var spokes = innerCircle.append("g")
            .attr("class", "spokes");

        for (var i = 0; i < partitionNum; ++i) {
            spokes.append("line")
                .attr("class", "spoke")
                .attr("transform", `rotate(${360 * i / partitionNum})`)
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", innerCircleR)
                .style("stroke-width", 0.6)
                .style("stroke", midGrey)
                .style("opacity", 1);
        }

        var innerCircleBgr = innerCircle.append("g")
            .attr("class", "innerbgr");

        innerCircleBgr.append("circle")
            .attr("class", "circle")
            .attr("r", innerCircleR)
            .style("stroke-width", 2.5)
            .style("stroke", grey)
            .style("opacity", 0.9)
            .style("fill", "none");

        innerCircleBgr.append("line")
            .attr("class", "dashedLine")
            .attr("x1", 0)
            .attr("y1", -innerCircleR)
            .attr("x2", -Math.sqrt(0.75) * innerCircleR)
            .attr("y2", innerCircleR / 2)
            .style("stroke-dasharray", "6,4")
            .style("stroke-width", 2.5)
            .style("stroke", grey)
            .style("opacity", 0.9);

        innerCircleBgr.append("line")
            .attr("class", "dashedLine")
            .attr("x1", 0)
            .attr("y1", -innerCircleR)
            .attr("x2", Math.sqrt(0.75) * innerCircleR)
            .attr("y2", innerCircleR / 2)
            .style("stroke-dasharray", "6,4")
            .style("stroke-width", 2.5)
            .style("stroke", grey)
            .style("opacity", 0.9);

        innerCircleBgr.append("line")
            .attr("class", "dashedLine")
            .attr("x1", -Math.sqrt(0.75) * innerCircleR)
            .attr("y1", innerCircleR / 2)
            .attr("x2", Math.sqrt(0.75) * innerCircleR)
            .attr("y2", innerCircleR / 2)
            .style("stroke-dasharray", "6,4")
            .style("stroke-width", 2.5)
            .style("stroke", grey)
            .style("opacity", 0.9);

        innerCircleBgr.append("text")
            .attr("x", 0)
            .attr("y", -innerCircleR)
            .attr("dy", -5)
            .attr("dx", -5)
            .text(() => 'U')
            .attr("fill", fontColor);

        innerCircleBgr.append("text")
            .attr("x", -Math.sqrt(0.75) * innerCircleR)
            .attr("y", innerCircleR / 2)
            .attr("dy", 10)
            .attr("dx", -15)
            .text(() => 'N')
            .attr("fill", fontColor);

        innerCircleBgr.append("text")
            .attr("x", Math.sqrt(0.75) * innerCircleR)
            .attr("y", innerCircleR / 2)
            .attr("dy", 10)
            .attr("dx", 5)
            .text(() => 'P')
            .attr("fill", fontColor);

        var leftNum = Math.floor(length * points.length);
        var circles = innerCircle.selectAll("point")
            .data(points.slice(0, leftNum)).enter()
            .append("circle")
            .attr("class", "point");

        circles
            .attr("transform", (d) => `rotate(${(180 + d[0])})`)
            .attr("cx", 0)
            .attr("cy", (d) => {
                var angle = d[0] % 120 - 60;
                if (angle < 0) angle = -angle;
                return d[1] * 0.5 / Math.cos(angle / 180 * Math.PI);
            })
            .attr("r", 4)
            .style("stroke-width", 2)
            .style("stroke", grey)
            .style("fill", (d) => d[2] < hue * 4 ? color(d[2]): "none")
            .style("opacity", (d) => d[2] + 1 < hue * 4 ? 0.9 : 0.9 * (hue * 4 - d[2]));
    }

    function drawInnerBar(size, length, hue, sat, opacity) {

        paint.select(".innerBar").remove();
        var innerBar = paint.append("g")
            .attr("class", "innerBar");

        const grayFilter = svg.append("filter")
            .attr("id", `gray-filter${filterCounter}`);

        grayFilter.append("feColorMatrix")
            .attr('type', 'saturate')
            .attr('values', sat);
            
        innerBar
            .attr("opacity", opacity)
            .attr("transform", `scale(${size})`)
            .style('filter', `url(#gray-filter${filterCounter}`);
        filterCounter++;

        var windowSize = Math.floor(aggregatedData.length * 0.2);
        var leftNum = Math.floor(aggregatedData.length * length);
        var bars = innerBar.selectAll("bar")
            .data(aggregatedData.slice(0, leftNum + windowSize)).enter()
            .append("g")
            .attr("class", "bar");

        var cosTheta = Math.cos(2 * Math.PI / partitionNum);
        var sinTheta = Math.sin(2 * Math.PI / partitionNum);
        for (var i = 0; i < typeNumber * hue; ++i) {
            bars.append("path")
                .attr("transform", (d, n) => `rotate(${n * 360 / partitionNum})`)
                .attr("d", (d, n) => {
                    var ratio = 0;
                    if (n < leftNum) {
                        ratio = 1;
                    } else if (n < leftNum + windowSize) {
                        ratio = (leftNum + windowSize - n) / windowSize;
                    } else ratio = 0;
                    var r0 = barHeight(i ? d[i - 1] : 0) * ratio + innerCircleR;
                    var r1 = barHeight(d[i]) * ratio + innerCircleR;
                    var path =
                        `M ${0} ${-r0}
                    A ${r0} ${r0} 0 0 1 ${(sinTheta * r0).toFixed(2)} ${(-cosTheta * r0).toFixed(2)}
                    L ${(sinTheta * r1).toFixed(2)} ${(-cosTheta * r1).toFixed(2)}
                    A ${r1} ${r1} 0 0 0 ${0} ${-r1} Z`;
                    return path;
                })
                .attr("fill", color(i))
                .style("stroke-width", 0.75)
                .style("stroke", midGrey)
                .style("opacity", typeNumber * hue - i);
        }
    }

    var finalTime = new Date().getTime();
}

const defaultCalendarData = [
    [2008, 0, 0.8691255570223496],
    [2008, 1, 0.10437336349684607],
    [2008, 2, 0.2711627261278114],
    [2008, 3, 0.5584585620718177],
    [2008, 4, 0.12375692500549113],
    [2008, 5, 0.11323225745736498],
    [2008, 6, 0.37337028899309777],
    [2008, 7, 0.17129784737740103],
    [2008, 8, 0.34413508328014475],
    [2008, 9, 0.24684464329121797],
    [2008, 10, 0.31330905744155835],
    [2008, 11, 1.6288704720435807],
    [2009, 0, 0.5689325808979688],
    [2009, 1, 0.1487192144327848],
    [2009, 2, 0.21565869176449903],
    [2009, 3, 0.46554450883350584],
    [2009, 4, 0.2028098814957062],
    [2009, 5, 0.24626664300772633],
    [2009, 6, 0.055911486512986636],
    [2009, 7, 0.15359988239896752],
    [2009, 8, 0.2854688867740763],
    [2009, 9, 0.2116276089356146],
    [2009, 10, 0.7158736278999316],
    [2009, 11, 0.7604246457547829],
    [2010, 0, 0.45263001901964545],
    [2010, 1, 0.17227457974775268],
    [2010, 2, 0.17780385849103664],
    [2010, 3, 0.4386999726139156],
    [2010, 4, 0.2936731357284408],
    [2010, 5, 0.16841782949016398],
    [2010, 6, 0.16466967283478484],
    [2010, 7, 0.2290019572289565],
    [2010, 8, 0.2026455136420695],
    [2010, 9, 0.37359760821271437],
    [2010, 10, 0.9069389707453193],
    [2010, 11, 0.7935359178393194]
];
const defaultPoints = [
    [64.76858591919223, 0.7561616264531379, 2],
    [69.23146127870965, 10.93382717581436, 2],
    [242.0944366219612, 74.48828652774608, 2],
    [90.96372077899925, 36.053283762744094, 3],
    [45.294916141935346, 64.64896046661796, 3],
    [73.56322288458307, 17.53727662038229, 2],
    [242.45804773288626, 56.65201597925871, 3],
    [247.24481359523253, 13.213874853623976, 2],
    [66.60391683338331, 3.6480155340757516, 2],
    [59.883500143518475, 0.9470157942274201, 0],
    [90.32545577048116, 40.97332796427244, 2],
    [69.98162083854827, 2.79977187841023, 1],
    [70.66977985257348, 79.25125815495801, 1],
    [85.7866696924642, 35.07214383249594, 2],
    [69.55758367610369, 116.85538592106707, 1],
    [68.9318844678612, 98.69801620845023, 3],
    [66.27805344173696, 97.46593477112083, 3],
    [85.9676931287864, 11.617107673907109, 1],
    [270.3587348130451, 75.16888347231955, 0],
    [253.74404128178276, 100.50355396509137, 0],
    [61.59304496237895, 98.36930097946312, 0],
    [84.54132097511567, 5.844194340872204, 3],
    [51.8347831699127, 36.44663337333247, 1],
    [39.347343578521205, 46.18684550439796, 3],
    [77.4771911996692, 48.112892792819466, 2],
    [68.66676627955319, 103.29298358681375, 2],
    [96.38687198897094, 110.40682733752519, 0],
    [80.33703959486043, 53.088627736494196, 0],
    [53.936855013869895, 22.15573971696511, 2],
    [252.87135276063907, 95.76079388485314, 2],
    [65.1543776373756, 120, 2],
    [85.98926460974104, 120, 1],
    [75.77484338935405, 42.05851987594166, 0],
    [272.0140688385386, 75.23767591986642, 0],
    [70.38447795125514, 5.511272467597983, 2],
    [109.17141722623523, 56.47390413467911, 2],
    [78.93057529132753, 120, 3],
    [80.24456756704515, 82.22040942251718, 1],
    [246.69082748048595, 50.15666574469787, 0],
    [91.1110140626522, 92.9495256059458, 3],
    [257.2735085601124, 2.7476993683193114, 0],
    [227.81044595213575, 27.03256041590737, 3],
    [104.31524540669332, 38.963050885619154, 2],
    [96.01005335105525, 12.968084024354166, 1],
    [97.17071299780883, 12.965206561373371, 3],
    [63.46813907004625, 120, 0],
    [53.739967079906094, 100.53499324105645, 3],
    [90.29929250315736, 62.93281414834287, 2],
    [70.21987989871636, 120, 0],
    [237.33716898613346, 48.949386561466724, 1],
    [40.20978362578446, 114.61334286160627, 3],
    [103.40857876232275, 52.468647179179236, 3],
    [61.342656729601565, 73.09124604999872, 0],
    [86.9707489607344, 3.0531724895764203, 2],
    [47.11544526055101, 53.69363179935292, 1],
    [76.69045254826871, 107.73615322441293, 1],
    [40.40310705180826, 29.54723959704177, 3],
    [73.96630805237645, 42.83887741469852, 1],
    [70.88446639351466, 17.585535856747587, 2],
    [79.36981247164873, 40.58246377273671, 3],
    [75.89648707916245, 100.04916007270133, 3],
    [249.59640626447336, 8.421352430978796, 2],
    [79.26613059730607, 24.785430179105, 2],
    [44.921404201595074, 120, 1],
    [67.54309154435605, 32.99336578723621, 3],
    [260.185525079036, 4.452436812398914, 2],
    [75.33997984546758, 3.1750085922449003, 0],
    [57.102085943771435, 100.01941946503506, 1],
    [238.3866706858181, 18.494523659447736, 2],
    [47.40912034803155, 120, 2],
    [53.02657087957856, 74.0826567388547, 0],
    [73.26661464977583, 110.96755918526877, 0],
    [55.22074683717611, 23.578536338467025, 0],
    [51.72845676366327, 15.129212037915527, 2],
    [76.132735343354, 104.16352963973969, 2],
    [68.26187551236428, 26.19103108852491, 3],
    [50.5795466812239, 98.43561918458529, 1],
    [88.00218032182285, 16.424036402571573, 3],
    [63.29709760075689, 59.04472923660808, 2],
    [75.08578182900297, 120, 3],
    [82.13277617500532, 20.038103678187362, 2],
    [56.02095584175646, 18.843554521984014, 0],
    [49.75897653999865, 99.7414180345513, 3],
    [88.54649851172728, 4.978878291471492, 2],
    [72.99592301934635, 37.67327841714104, 3],
    [66.60826107532927, 120, 2],
    [253.04410395549235, 56.97715708104989, 1],
    [74.6692412309163, 79.63064438758892, 1],
    [69.39734363687424, 120, 0],
    [68.82810102248575, 70.05104025788539, 3],
    [89.81177819208487, 76.58534624251357, 0],
    [94.62825639543594, 81.28826978805154, 3],
    [62.19763025698139, 107.50899142404268, 3],
    [79.8959226728054, 11.250119592391316, 2],
    [61.419525934248675, 120, 3],
    [90.5979611724162, 59.49157819965685, 0],
    [74.67613868178206, 13.421862127684541, 3],
    [53.12839049957776, 120, 2],
    [81.78799112644433, 12.123383185616122, 2],
    [71.01969430654167, 54.49339515487614, 0],
    [94.26005596339445, 116.10630292045046, 3],
    [224.55812851574024, 36.911111791946766, 2],
    [58.06703565796748, 1.5479017882711972, 2],
    [71.87743085008292, 9.317255888119124, 0],
    [38.01314694909968, 120, 1],
    [67.69621204447049, 104.5611958950532, 1],
    [47.461176651721985, 36.72954107439829, 0],
    [42.918029338890655, 64.66518303040377, 3],
    [58.36631195104421, 120, 0],
    [242.0512307649282, 112.81119508689513, 2],
    [64.70895249944041, 120, 0],
    [64.4954444441639, 23.249902672000946, 1],
    [56.15874757419588, 81.83610786764412, 1],
    [244.1273164685599, 112.26703967047807, 3],
    [90.63418832917864, 2.0475582757035564, 2],
    [234.936649467387, 76.37094458905095, 0],
    [229.211475891433, 91.72601769994247, 3],
    [50.63392881407604, 120, 2],
    [63.1380709707036, 2.266378524629729, 1],
    [70.61198928773901, 64.82583950590285, 1],
    [53.27744287108653, 120, 3],
    [259.2365289032737, 73.28332812166111, 2],
    [260.6269767357529, 84.8542203244227, 2],
    [90.5718784151919, 120, 2],
    [49.8301368381163, 30.039435778223595, 2],
    [243.91772538257254, 18.356171257028475, 0],
    [61.5455286882775, 110.19395004058694, 2],
    [46.9391020891386, 17.10893316356661, 3],
    [45.6782091759908, 52.49190336793907, 1],
    [70.8688815912926, 120, 0],
    [73.68048206937901, 114.3190293208204, 1],
    [67.41529420570618, 120, 2],
    [67.56007748817895, 33.57483178565235, 0],
    [85.01415836437897, 7.694032010037399, 0],
    [98.67940914493377, 108.1029648450344, 0],
    [78.1886936666672, 51.098449041847104, 2],
    [56.06880627526811, 16.93218686818342, 2],
    [76.08716819306234, 90.58890982476024, 0],
    [257.4691847051979, 13.766721631587858, 1],
    [69.55816748740298, 3.4995328424101086, 0],
    [116.47636966967796, 77.60765097202494, 1],
    [261.43297307954526, 120, 2],
    [77.08833191882019, 17.97355011042348, 2],
    [67.46110756903889, 76.19506607523567, 3],
    [77.17381221481187, 27.508771740068326, 0],
    [249.79632465226072, 20.034101597375628, 0],
    [58.154042249704275, 120, 2],
    [89.14997107000795, 32.167856300935725, 1],
    [86.4460086693279, 0.08508652801693284, 0],
    [234.28330836951707, 120, 2],
    [73.91080802870626, 120, 0],
    [82.70336225441062, 120, 2],
    [59.77393878964078, 120, 2],
    [82.90023143662357, 68.94571001576405, 1],
    [65.1301727210825, 120, 1],
    [69.22790876648122, 86.10586849369348, 2],
    [36.58318660068393, 73.95683747084274, 0],
    [67.62051099446123, 82.02526455838844, 0],
    [69.43416481249827, 83.7830207413029, 1],
    [250.91713283345365, 93.42874160404477, 0],
    [67.72473871747495, 120, 0],
    [38.59234301495006, 36.135203889474276, 1],
    [68.3417728811171, 76.82635093455434, 1],
    [78.40356639960545, 109.89365228447734, 3],
    [41.554920777916365, 46.042722348598424, 2],
    [242.97200954299493, 53.635808703729445, 2],
    [73.81280887213644, 107.01668945185551, 0],
    [64.87900957831442, 30.047508462934164, 0],
    [263.1998225902903, 55.1787635056036, 1],
    [72.43817191309759, 120, 0],
    [270.2803543942007, 111.85826091793149, 3],
    [70.60607550676644, 80.27493851414891, 0],
    [63.35547488008412, 90.9159411988319, 1],
    [84.95349626054156, 120, 2],
    [69.61886688088104, 41.11245622705128, 0],
    [84.67736120245469, 76.15110223707731, 2],
    [55.34316927327793, 120, 0],
    [255.2956120490131, 120, 2],
    [72.59842066319682, 97.54351391283893, 1],
    [62.76401618516048, 86.43966323689473, 3],
    [62.36442811939519, 0.4177252310044297, 3],
    [236.58723266024313, 71.05178151554998, 1],
    [75.83544606482418, 69.63636940530223, 1],
    [65.10689061532474, 44.52390737216849, 0],
    [70.82584828920024, 104.49858051140038, 1],
    [51.250249527371395, 8.0510746309494, 3],
    [79.64473655099823, 7.248210106755429, 0],
    [68.59562613698719, 120, 2],
    [77.44718958298614, 0.9222207971381459, 2],
    [63.61102543356632, 60.17663269461022, 2],
    [60.40192449208558, 26.889328242815115, 2],
    [91.56076014334896, 38.07255257482481, 3],
    [64.20196838545787, 120, 0],
    [60.78135700142304, 43.43128214473357, 1],
    [249.4696201660709, 19.996890959771566, 0],
    [101.9716829206841, 120, 0],
    [254.56475055869686, 13.399219424075945, 0],
    [48.02288176916388, 120, 3],
    [250.89901382565284, 29.018224636499287, 2],
    [239.92462955511348, 8.317194373346405, 3],
    [231.22101149490499, 16.149799525540285, 1],
    [79.28220031633606, 32.54415258289202, 2],
    [65.4406709421421, 20.47294918423358, 1],
    [43.489710471811115, 120, 3],
    [72.15468174650366, 49.77118738517712, 0],
    [64.83558495801647, 105.65038054568066, 0],
    [65.01979651971536, 120, 3],
    [37.64184513023138, 113.81189668111315, 2],
    [85.31915713920155, 67.83533919541921, 0],
    [92.15724234701932, 12.060088389910662, 3],
    [36.152407438751226, 120, 1],
    [235.97522315762853, 26.23551300836107, 3],
    [67.31877195380291, 14.958534371099384, 0],
    [113.75884079480184, 111.85422234722103, 2],
    [43.549059323837184, 120, 0],
    [48.234892120251, 85.65579169699721, 0],
    [224.43219290765444, 90.3659346912171, 1],
    [258.0555494391568, 81.22727821697859, 3],
    [73.71149389841494, 20.387474665701582, 1],
    [61.07896804113204, 51.24664634244011, 2],
    [100.64943472819195, 120, 0],
    [57.50231776988449, 120, 3],
    [255.02330794990476, 64.9601538284249, 3],
    [62.72570816455052, 120, 3],
    [81.62747281288453, 120, 1],
    [94.73771178956746, 37.6331667416557, 3],
    [51.66869884060566, 101.58736572251499, 1],
    [52.67962839807635, 98.26905385628842, 1],
    [82.42526232959872, 120, 0],
    [243.53768258331957, 3.9907674614872137, 2],
    [67.3380984026501, 96.09931338939575, 2],
    [90.68973236890092, 27.406516279692806, 3],
    [56.99816420965273, 120, 3],
    [240.16427908550924, 71.91248600719841, 1],
    [245.41187885161656, 26.22898239759173, 2],
    [83.45227576369383, 99.88502810242302, 0],
    [268.9464865909492, 4.178350330019047, 3],
    [67.3136114345949, 17.861652648454644, 2],
    [82.34204748895469, 37.13001633698288, 2],
    [61.61903142153169, 111.61204993641837, 3],
    [64.81865381058549, 101.3015645470522, 2],
    [81.24372609949678, 54.14937968224051, 2],
    [241.5382379183439, 117.04275474849985, 1],
    [71.63568784629734, 120, 1],
    [82.69217817485958, 84.554276659549, 1],
    [94.18262914372002, 22.12393603240152, 1],
    [58.50970911554483, 58.91749192234987, 2],
    [261.32514648867, 19.609447177156053, 3],
    [45.61829035528059, 18.71979570340764, 3],
    [59.20478186510845, 49.53253720440557, 3],
    [269.7583556898732, 83.73806758099906, 3],
    [250.41118656164477, 88.37278497446424, 1],
    [54.3496480055712, 120, 0],
    [56.074377804054805, 84.96182629614817, 2],
    [81.72519442471946, 85.54046917376584, 0],
    [70.54653812705024, 102.94555313593895, 1],
    [72.83961138980108, 35.53140012415604, 1],
    [77.7458519737116, 24.624924677375766, 3],
    [57.92124419271361, 20.785055221090886, 2],
    [88.17527640754821, 22.434265028228623, 0],
    [76.01143847696868, 120, 2],
    [248.49834090511678, 83.36002242870578, 1],
    [57.342956220356015, 120, 0],
    [94.62934775120962, 38.818282015942465, 2],
    [45.94630208154623, 84.58615480729719, 2],
    [65.18048758450757, 120, 0],
    [93.42260005853043, 1.2497063351229771, 2],
    [224.52007903937374, 61.178639615020515, 0],
    [57.1781754144268, 60.55344986213237, 3],
    [74.48930769940982, 39.24174280836639, 0],
    [51.56400295605166, 71.23456474352088, 2],
    [54.23572180896869, 76.504252935828, 3],
    [223.85390994144325, 103.23713484077828, 2],
    [65.9319005818849, 116.0810554139565, 0],
    [74.57799500339026, 85.21113300009321, 3],
    [89.61643143039358, 120, 1],
    [71.38856587949164, 120, 1],
    [71.13219931109236, 79.1483923839609, 0],
    [87.48066202663863, 120, 0],
    [60.254687498212334, 62.57785574652357, 3],
    [256.833287496461, 7.165495226810143, 3],
    [73.74059608988799, 92.78337244571546, 3],
    [55.60944174256586, 120, 2],
    [67.17177977927031, 120, 2],
    [56.605998917275066, 107.24032261543952, 0],
    [62.21895365905372, 87.55261376176259, 3],
    [78.21033554414176, 92.39993049921456, 3],
    [56.41949182629277, 98.39041269298241, 0],
    [73.85660302011854, 86.04181237364702, 3],
    [82.91489324473748, 85.7559101504373, 1],
    [56.33932455308856, 56.43169978004246, 1],
    [251.70677262150411, 7.065272666417677, 0],
    [70.82184414417291, 85.57501690584078, 3],
    [53.58433951945979, 9.59595821166828, 2],
    [64.4208395023294, 61.0743483292884, 3],
    [71.90019509448881, 13.776581227041278, 2],
    [68.10307849063298, 18.96124277748338, 0],
    [87.89018304475131, 120, 3],
    [52.25696558756478, 102.20070664165377, 0],
    [68.5594339693592, 63.83540884364935, 2],
    [70.68915030307966, 73.91601495874438, 1],
    [61.429121200571636, 26.327002910314086, 0],
    [80.0761575304771, 120, 3],
    [56.11868714066928, 99.9643495856513, 1],
    [259.3840580857611, 31.799557778120214, 3],
    [80.125216719315, 77.86880123270474, 1],
    [74.39400346569326, 35.32307012952382, 1],
    [260.4022197282858, 95.56532691401846, 1],
    [242.7886667080128, 91.32491447747275, 3],
    [64.37443744939503, 13.333302567249367, 3],
    [63.758428864720166, 120, 2],
    [58.83761448157706, 119.75982651037657, 2],
    [72.30326516592339, 49.72448740273713, 3],
    [64.22412683490026, 4.749446499539257, 2],
    [66.20202584858849, 75.91981551918579, 0],
    [63.91967881325092, 74.29081402154243, 2],
    [59.457355808881964, 52.793846143653965, 3],
    [269.9211811151245, 90.74629336344638, 2],
    [250.48570980386313, 39.66006075234557, 1],
    [225.39266591668047, 33.13242107399108, 0],
    [72.3855379055748, 85.29325510096916, 1],
    [61.84572592601167, 117.12358416909619, 2],
    [78.2729754711531, 74.35782652727613, 3],
    [50.62988607439152, 52.36307772369712, 2],
    [238.08787659267043, 79.33144027475582, 1],
    [63.399718895075665, 100.1272107147726, 0],
    [72.88499340319484, 120, 1],
    [83.02026427685078, 120, 2],
    [238.3814137042619, 56.50853688841172, 0],
    [72.71216255511641, 114.09273768541615, 1],
    [70.461181674184, 108.95928414519982, 3],
    [76.10635762858568, 44.74606330014413, 2],
    [58.4650977562322, 120, 3],
    [92.5209515991757, 97.0943987385358, 2],
    [74.90857058447908, 30.714546543613594, 2],
    [49.15009458727519, 42.689856239998015, 1],
    [58.65679229576094, 120, 1],
    [55.0113990971942, 18.007801999225332, 3],
    [84.04965426505329, 60.79669796568259, 0],
    [67.01650309815325, 46.83598764929391, 0],
    [58.5282828194394, 107.937425860918, 1],
    [75.17227622397321, 120, 3],
    [83.62746400743302, 81.00224952321321, 3],
    [256.1974226162424, 79.30368102494694, 0],
    [71.85392892730741, 4.731278309502982, 2],
    [58.4584465900692, 18.31822302689307, 1],
    [239.21540988942635, 24.65683241778835, 3],
    [63.17582213072195, 120, 1],
    [73.17952639056175, 56.007637604035246, 0],
    [77.80889463879944, 22.77129833015086, 3],
    [87.1642277542996, 25.6846697360516, 1],
    [54.54177391516595, 33.998050785560935, 0],
    [239.82162144883947, 120, 0],
    [79.63439535324105, 37.16804113656847, 0],
    [66.58389319728374, 82.1314340055534, 0],
    [61.048666499468375, 47.606936369548926, 2],
    [252.63522315196647, 105.4976111157747, 3],
    [102.21242948887587, 106.09946429915698, 0],
    [63.23704146696641, 120, 1],
    [58.81302122986331, 120, 2],
    [51.53664379167408, 6.778033752713276, 3],
    [101.59946171623776, 34.97469503717184, 2],
    [256.08410225306125, 46.214759866131864, 3],
    [251.95100279001764, 107.26096600415767, 0],
    [62.262399567521825, 118.96652904274409, 0],
    [80.35977232996964, 64.3382807505954, 0],
    [80.62316850366352, 120, 2],
    [259.7874386294078, 77.87443178219316, 1],
    [75.71201739755516, 120, 0],
    [63.72904387648358, 80.10534472277212, 1],
    [73.84893603622993, 120, 2],
    [237.72093357791795, 120, 0],
    [89.48569212794419, 115.83584698409688, 0],
    [72.83493411848356, 84.84367089652724, 2],
    [72.73910429390459, 102.98796276320894, 2],
    [53.18537162613539, 116.88256537808702, 3],
    [63.287310852737534, 89.14935109588961, 3],
    [83.63884951888858, 51.34416920825266, 3],
    [91.31415864254471, 20.118032664151873, 3],
    [68.5554456486821, 120, 2],
    [74.00089174334039, 49.7303226944421, 0],
    [89.28598186081074, 25.860248461159344, 2],
    [77.73337564607044, 120, 0],
    [92.19278201763359, 29.132711753004937, 2],
    [98.33638113435343, 36.15303323476204, 1],
    [83.35723279411854, 29.583806674311244, 0],
    [57.16167672806846, 58.80098768504092, 2],
    [34.55733829636118, 120, 2],
    [46.269046211651755, 23.541403881932432, 2],
    [71.20548340533622, 120, 1],
    [92.68666019845847, 120, 2],
    [46.891957009813794, 120, 1],
    [243.38497409050595, 11.164737970287916, 0],
    [44.92419672133783, 60.89719649176594, 2],
    [78.97305181896238, 17.94384317035598, 3],
    [55.24966564719487, 120, 3],
    [252.61156934910872, 110.44803722263252, 0],
    [264.1881826907743, 119.50918825156619, 2],
    [79.31217854292964, 120, 2],
    [78.78956686736493, 7.899657787231627, 0]
];
