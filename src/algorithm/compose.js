const sample_num = 3;

function sqr(x) {
    return x * x;
}

function distanceSqr(a, b) {
    return sqr(a.centroid[0] - b.centroid[0]) + sqr(a.centroid[1] - b.centroid[1]);
}

function distance(a, b) {
    return Math.sqrt(distanceSqr(a, b));
}

function getOuterBox(element) {
    let x0 = width, y0 = height, x1 = 0, y1 = 0;
    const points = element.points;
    for (let j = 0; j < points.length; j += 2) {
        if (points[j] > x1) {
            x1 = points[j];
        } else if (points[j] < x0) {
            x0 = points[j];
        }
        if (points[j + 1] > y1) {
            y1 = points[j + 1];
        } else if (points[j + 1] < y0) {
            y0 = points[j + 1];
        }
    }
    return {
        x0, y0, x1, y1
    };
}

function findNearest(elements, gradient, maxDistance = 75) {
    const tick_num = gradient.map(d => Math.ceil(1.0 / d));
    const maxDistanceSqr = maxDistance * maxDistance;
    const colorHash = (color) => (
        Math.floor(color[0] / gradient[0]) * tick_num[1] * tick_num[2] +
        Math.floor(color[1] / gradient[1]) * tick_num[2] +
        Math.floor(color[2] / gradient[2])
    );
    const last = new Array(tick_num[0] * tick_num[1] * tick_num[2]);
    const relations = new Array();
    for (const element of elements) {
        const hashcode = colorHash(element.color);
        if (last[hashcode] && distanceSqr(last[hashcode], element) < maxDistanceSqr) {
            relations.push([last[hashcode], element]);
        }
        last[hashcode] = element;
    }
    return relations;
}

function findNearestNaive(elements, gradient, maxDistance = 30) {
    const tick_num = gradient.map(d => Math.ceil(1.0 / d));
    const maxDistanceSqr = maxDistance * maxDistance;
    const f = (d) => Math.floor(d * 10);
    const colorHash = (color) => (
        Math.floor(color[0] / gradient[0]) * tick_num[1] * tick_num[2] +
        Math.floor(color[1] / gradient[1]) * tick_num[2] +
        f(color[2])
    );
    tick_num[2] = 10;
    const n = tick_num[0] * tick_num[1] * tick_num[2];
    const last = new Array(n);
    const relations = new Array();
    for (const element of elements) {
        const hashcode = colorHash(element.color);
        if (!last[hashcode]) {
            last[hashcode] = [];
        }
        last[hashcode].push(element);
    }
    for (let k = 0; k < n; ++k) if (last[k] != null && last[k].length > 1) {
        const el = last[k];
        for (let i = 0; i < el.length; ++i) {
            const a = el[i];
            for (let j = i + 1; j < el.length; ++j) {
                const b = el[j];
                if (b.centroid[0] - a.centroid[0] > maxDistance) break;
                if (distanceSqr(a, b) > maxDistanceSqr) continue;
                relations.push([a, b]);
            }
        }
    }
    return relations;
}

/* // this order is by color
const ordered_elements = elements.sort((a, b) => {
    if (Math.abs(a.color[0] - b.color[0]) < Number.EPSILON) {
        return a.color[0] - b.color[0];
    } else if (Math.abs(a.color[1] - b.color[1]) < Number.EPSILON) {
        return a.color[1] - b.color[1];
    } else if (Math.abs(a.color[2] - b.color[2]) < Number.EPSILON) {
        return a.color[2] - b.color[2];
    } else {
        return 0;
    }
});
*/



function findNearestP(elements, gradient, maxDistance = 20) {
    const tick_num = gradient.map(d => Math.ceil(1.0 / d));
    const maxDistanceSqr = maxDistance * maxDistance;
    const f = (d) => Math.floor(d * 10);
    const colorHash = (color) => (
        Math.floor(color[0] / gradient[0]) * tick_num[1] * tick_num[2] +
        Math.floor(color[1] / gradient[1]) * tick_num[2] +
        f(color[2])
    );
    tick_num[2] = 10;
    const n = tick_num[0] * tick_num[1] * tick_num[2];
    const last = new Array(n);
    const relations = new Array();
    for (const element of elements) {
        const hashcode = colorHash(element.color);
        if (!last[hashcode]) {
            last[hashcode] = [];
        }
        last[hashcode].push(element);
    }
    for (let k = 0; k < n; ++k) if (last[k] != null && last[k].length > 1) {
        const el = last[k];
        for (let i = 0; i < el.length; ++i) {
            const a = el[i];
            for (let j = i + 1; j < el.length; ++j) {
                const b = el[j];
                if (b.centroid[0] - a.centroid[0] > maxDistance) break;
                if (distanceSqr(a, b) > maxDistanceSqr) continue;
                relations.push([a, b]);
            }
        }
    }
    return relations;
}

export function findGroup(element, currentTime = Number.MAX_VALUE) {
    while (element.father && element.timestamp <= currentTime) {
        element = element.father;
    }
    return element;
}

export function compose(elements, width, height, gradient = [0.01, 0.02, 0.2]) {
    const relations = Array.concat(
        findNearestNaive(elements.sort((a, b) => a.centroid[0] - b.centroid[0]), gradient)
    ).map(d => ({
        dist: distanceSqr(d[0], d[1]),
        link: d,
    })).sort((a, b) => a.dist - b.dist);

    for (const element of elements) {
        element.father = null;
        element.rank = 0;
        element.neighbor = [];
    }
    
    let timestamp = 0;
    for (const relation of relations) {
        relation.link[0].neighbor.push(relation.link[1]);
        relation.link[1].neighbor.push(relation.link[0]);
        const u = findGroup(relation.link[0]);
        const v = findGroup(relation.link[1]);
        if (u === v) {
            continue;
        } else {
            if (u.rank === v.rank) {
                v.father = u;
                v.timestamp = timestamp++;
                u.rank += 1;
            } else if (u.rank > v.rank) {
                v.father = u;
                v.timestamp = timestamp++;
            } else {
                u.father = v;
                u.timestamp = timestamp++;
            }
        }
    }
    return elements;
}
