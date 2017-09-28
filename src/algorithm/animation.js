const maxCounter = 30;
const frame = 50;
const duration = 500;
import { opinionseer } from "./opinionseer.js";

export function annoTransition(svg) {
    svg.select('.annotation')
        .transition().duration(duration)
        .style("opacity", 1);
}

var refreshIntervalId = null;

export function stopTransition() {
    if (refreshIntervalId != null) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
    }
}

export function shapeTransition(prevStatus, nextStatus, name, svg) {
    var counter = 0;
    var width = +svg.attr("width");
    var height = +svg.attr("height");

    if (refreshIntervalId != null) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
        setTimeout(() => shapeTransition(prevStatus, nextStatus, name), frame, svg);
        return;
    }

    if (name == "high-light") {
        refreshIntervalId = setInterval(() => {
            if (++counter > maxCounter * 2) {
                clearInterval(refreshIntervalId);
                refreshIntervalId = null;
                return;
            }
            var status = JSON.parse(JSON.stringify(prevStatus));
            var cnt = counter > maxCounter ? maxCounter * 2 - counter : counter;
            cnt = Math.min(cnt * 2, maxCounter);
            for (var i = 0; i < status.length; ++i) {
                if (status[i].highlight) break;
                status[i].sat = (prevStatus[i].sat * (maxCounter - cnt)) / maxCounter;
                status[i].opacity = (prevStatus[i].opacity * (maxCounter - cnt) + 0.1 * cnt) / maxCounter;
            }
            opinionseer(svg, width, height, status);
        }, frame);
    } else {
        refreshIntervalId = setInterval(() => {
            if (++counter > maxCounter) {
                clearInterval(refreshIntervalId);
                refreshIntervalId = null;
                return;
            }
            var status = JSON.parse(JSON.stringify(prevStatus));
            for (var i = 0; i < status.length; ++i) {
                if (JSON.stringify(prevStatus[i]) == JSON.stringify(nextStatus[i])) {
                    status[i].ignore = true;
                } else {
                    status[i].sat = (prevStatus[i].sat * (maxCounter - counter) + nextStatus[i].sat * counter) / maxCounter;
                    status[i].hue = (prevStatus[i].hue * (maxCounter - counter) + nextStatus[i].hue * counter) / maxCounter;
                    status[i].size = (prevStatus[i].size * (maxCounter - counter) + nextStatus[i].size * counter) / maxCounter;
                    status[i].length = (prevStatus[i].length * (maxCounter - counter) + nextStatus[i].length * counter) / maxCounter;
                    status[i].opacity = (prevStatus[i].opacity * (maxCounter - counter) + nextStatus[i].opacity * counter) / maxCounter;
                    status[i].position = (prevStatus[i].position * (maxCounter - counter) + nextStatus[i].position * counter) / maxCounter;
                }
            }
            opinionseer(svg, width, height, status);
        }, frame);
    }
}
