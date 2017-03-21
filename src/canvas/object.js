const fps = 20;
const LineMergeThreshold1 = 15;
const LineMergeThreshold2 = 1.2;
const LineMergeThreshold3 = 10;

function smooth(a) {
    const window = 10;
    const c = 1.0 / window;
    const b = new Float32Array(a.length);
    for (let i = 0, cnt = 0; i < a.length; ++i) {
        cnt += a[i];
        if (i >= window) {
            cnt -= a[i - window];
        }
        b[i] = cnt * c;
    }
    for (let i = window - 1; i >= 0; --i) {
        b[i] = b[window];
    }
    for (let i = 0; i < a.length; ++i) {
        a[i] = b[i];
    }
}

export class Canvas {
    constructor(canvas, width, height) {
        width = width || canvas.width;
        height = height || canvas.height;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.items = new Array();
        this.itemTables = new Array();
        this.backgroundImg = null;
        this.bgAlpha = 1;
    }

    clear() {
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;
        ctx.clearRect(0, 0, width, height);
    }

    drawBackground() {
        if (this.backgroundImg === null) {
            return;
        }
        const ctx = this.ctx;
        const img = this.backgroundImg;
        ctx.globalAlpha = this.bgAlpha;
        ctx.drawImage(img, 0, 0);
        ctx.globalAlpha = 1;
    }

    removeItem(item) {
        const items = this.items;
        if (!item || item.index >= items.length || items[item.index] !== item) {
            return;
        }
        items.splice(item.index, 1);
        for (let i = 0; i < items.length; ++i) {
            items[i].index = i;
        }
    }

    addItem(item) {
        const items = this.items;
        item.index = items.length;
        item.canvas = this;
        items.push(item);
    }

    getItem(x, y) {
        for (const item of items) {
            if (item.hasPixel(x, y)) {
                return item;
            }
        }
        return null;
    }

    render(timestamp) {
        timestamp = timestamp || 0;
        const items = this.itemTables[timestamp] || this.items;
        const canvas = this.canvas;
        this.clear();
        this.drawBackground();
        for (const item of items) {
            item.render(this);
        }
    }
}

export class Item {
    constructor(_) {
        let lines;
        let color;
        if (_ instanceof Array) {
            lines = [];
            const items = _;
            const L1 =
                Array.concat(...items.map(item => item.lines))
                    .sort((a, b) => {
                        if (a.x !== b.x) {
                            return a.x - b.x;
                        } else if (a.y1 !== b.y1) {
                            return a.y1 - b.y1;
                        } else {
                            return a.y2 - b.y2;
                        }
                    });

            const L2 = [];
            const pre = [];
            const c = [];
            let ptn = 0, last = 0, lastnum = 0;
            const xrange = [L1[0].x, L1[L1.length - 1].x];
            for (let i = 0; i < L1.length; ++i) {
                if (i === L1.length - 1 || L1[i].x !== L1[i + 1].x) {
                    const segments = [];
                    for (let j = last; j <= i; ++j) {
                        segments.push(+L1[j].y1);
                        segments.push(-L1[j].y2);
                    }
                    segments.sort(
                        (a, b) =>
                            ((a > 0 ? a : -a) - (b > 0 ? b : -b))
                    );
                    let segcnt = 0, left = 0;
                    const p = [];
                    for (let i = 0; i < segments.length; ++i) {
                        if (segments[i] >= 0) {
                            if (segcnt === 0) {
                                left = segments[i];
                            }
                            ++segcnt;
                        } else {
                            --segcnt;
                            if (segcnt === 0) {
                                p.push(left);
                                p.push(-segments[i]);
                            }
                        }
                    }

                    let mingap = LineMergeThreshold1;
                    while (p.length >= lastnum * 2) {
                        let k = -1;
                        for (let j = 1; j + 1 < p.length; j += 2) {
                            if (p[j + 1] - p[j] < mingap) {
                                mingap = p[j + 1] - p[j];
                                k = j;
                            }
                        }
                        mingap = mingap * LineMergeThreshold2 + LineMergeThreshold3;
                        if (k === -1 && p.length <= (lastnum + 1) * 2) {
                            break;
                        } else if (k !== -1) {
                            p.splice(k, 2);
                        } else {
                            break;
                        }
                    }

                    const x = L1[i].x;
                    L2[x] = p;
                    c[x] = new Int32Array(p.length);
                    pre[x] = new Int32Array(p.length);
                    if (!L2[x - 1]) {
                        for (let i = 0; i < p.length; ++i) {
                            c[x][i] = 0;
                        }
                    } else {
                        const q = L2[x - 1];
                        for (let i = 1, j = 2; i + 1 < p.length; i += 2) {
                            while (j < q.length && q[j] < p[i]) {
                                j += 2;
                            }
                            if (j >= q.length || q[j - 1] > p[i + 1]) {
                                c[x][i] = 1;
                            } else {
                                c[x][i] = c[x - 1][j - 1] + 1;
                                pre[x][i] = j - 1;
                            }
                        }
                    }

                    lastnum = p.length / 2;
                    last = i + 1;
                }
            }
            
            for (let x = xrange[1]; x >= xrange[0]; --x) if (!!c[x]) {
                const height = L2[x][L2[x].length - 1] - L2[x][0];
                for (let i = 1; i + 1 < c[x].length; i += 2) {
                    if (pre[x][i] !== 0) {
                        c[x - 1][pre[x][i]] = c[x][i];
                    }
                    if (c[x][i] < 20 && (L2[x][i + 1] - L2[x][i]) < height * 0.2) {
                        L2[x][i] = L2[x][i + 1] = -1;
                    }
                }
                L2[x] = L2[x].filter(d => d !== -1);
            }
            

            for (let x = xrange[0]; x <= xrange[1]; ++x) if (!!c[x]) {
                for (let i = 0; i < L2[x].length; i += 2) {
                    lines.push({
                        x,
                        y1: L2[x][i],
                        y2: L2[x][i + 1],
                    });
                }
            }
            console.log(c, L2);
            
            color = [0, 0, 0];
            let cnt = 0;
            for (const item of items) {
                for (let i = 0; i < 3; ++i) {
                    color[i] += item.lines.length * item.color[i];
                }
                cnt += item.lines.length;
            }
            console.log('color', color[0], color[1], color[2]);
            for (let i = 0; i < 3; ++i) {
                color[i] /= cnt;
            }

            this.lines = lines;
            this.hue = color[0] * 360;
            this.saturation = color[1];
            this.lightness = color[2];
            this.alpha = 1;
            this.x = Math.min(...lines.map(d => d.x));
            this.y = Math.min(...lines.map(d => d.y1));
            this.w = Math.max(...lines.map(d => d.x)) - this.x;
            this.h = Math.max(...lines.map(d => d.y2)) - this.y;
            this.x0 = this.x;
            this.y0 = this.y;
            this.w0 = this.w;
            this.h0 = this.h;
            this.appeartime = null;
            this.fstatus = null;
            this.tstatus = null;
            this.duration = null;
        } else if (!(_ instanceof Item)) {
            const item = _;
            const color = item.color;
            lines = item.lines;
            this.lines = item.lines;
            this.hue = color[0] * 360;
            this.saturation = color[1];
            this.lightness = color[2];
            this.alpha = 1;
            this.x = Math.min(...lines.map(d => d.x));
            this.y = Math.min(...lines.map(d => d.y1));
            this.w = Math.max(...lines.map(d => d.x)) - this.x;
            this.h = Math.max(...lines.map(d => d.y2)) - this.y;
            this.x0 = this.x;
            this.y0 = this.y;
            this.w0 = this.w;
            this.h0 = this.h;
            this.appeartime = null;
            this.fstatus = null;
            this.tstatus = null;
            this.duration = null;
        } else {
            this.lines = _.lines;
            this.hue = _.hue;
            this.saturation = _.saturation;
            this.lightness = _.lightness;
            this.alpha = _.alpha;
            this.x = _.x;
            this.y = _.y;
            this.w = _.w;
            this.h = _.h;
            this.x0 = _.x0;
            this.y0 = _.y0;
            this.w0 = _.w0;
            this.h0 = _.h0;
        }
    }

    cross(x1, y1, x2, y2) {
        if (x1 instanceof Object) {
            const line = x1;
            return this.cross(line.x1, line.y1, line.x2, line.y2);
        } else {
            if (x1 > x2) {
                return this.cross(line.x2, line.y2, line.x1, line.y1);
            } else if (x1 === x2) {
                for (const line of lines) {
                    if (line.x === x1 && line.y2 > y1 && line.y1 < y2) {
                        return true;
                    }
                }
                return false;
            } else {
                const c = (y2 - y1) / (x2 - x1);
                const dy = y2 - y1;
                for (const line of lines) {
                    if (line.x < x1 || line.x > x2) {
                        continue;
                    }
                    const y = (line.x - x1) * c;
                    if (y > 0 && y < dy) {
                        return true;
                    }
                }
                return false;
            }
        }
    }

    toString() {
        return JSON.stringify({
            lines: this.lines,
            color: this.color,
            animation: null,
        });
    }

    compress() {
        const width = this.w0 + 1;
        const ys = new Float32Array(width);
        const ws = new Float32Array(width);
        const x0 = this.x0;
        for (const line of lines) {
            ys[line.x - x0] += (line.y1 + line.y2) * 0.5 * (line.y2 - line.y1);
            ws[line.x - x0] += (line.y2 - line.y1);
        }
        for (let i = 0; i < ws.length; ++i) {
            if (ws[i] !== 0) {
                ys[i] /= ws[i];
            }
        }
        this.ys = ys;
        this.ws = ws;
    }



    transformat() {
        const rw = 1.0 / this.w0 * this.w;
        const rh = 1.0 / this.h0 * this.h;
        const lines = this.lines;
        const x0 = this.x0;
        const y0 = this.y0;
        const x = this.x;
        const y = this.y;
        const newlines = [];
        for (const line of lines) {
            const xx = ~~((line.x - x0) * rw + x);
            const y1 = ~~((line.y1 - y0) * rh + y);
            const y2 = ~~((line.y2 - y0) * rh + y);
            newlines.push({
                x: xx,
                y1: y1,
                y2: y2
            });
        }
        this.lines = newlines;
        this.x0 = this.x;
        this.y0 = this.y;
        this.w0 = this.w;
        this.h0 = this.h;
    }

    render() {
        const canvas = this.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const ctx = canvas.ctx;
        const rw = 1.0 / this.w0 * this.w;
        const rh = 1.0 / this.h0 * this.h;
        const hue = ~~this.hue;
        const saturation = ~~(this.saturation * 100);
        const lightness = ~~(this.lightness * 100);
        const alpha = this.alpha;
        ctx.strokeStyle = `hsla(${hue},${saturation}%,${lightness}%,${alpha})`;
        ctx.lineWidth = rw;

        const lines = this.lines;
        const x0 = this.x0;
        const y0 = this.y0;
        const x = this.x;
        const y = this.y;

        for (const line of lines) {
            const xx = ~~((line.x - x0) * rw + x);
            const y1 = ~~((line.y1 - y0) * rh + y);
            const y2 = ~~((line.y2 - y0) * rh + y);
            ctx.beginPath();  
            ctx.moveTo(xx, y1 - 1);
            ctx.lineTo(xx, y2 + 1);
            ctx.stroke();
            ctx.closePath();  
        }
    }

    hasPixel(x, y) {
        const rw = 1.0 / this.w0 * this.w;
        for (const line of lines) {
            if (Math.abs(line.x - x) <= rw && y >= line.y1 && y <= line.y2) {
                return true;
            }
        }
        return false;
    }

    createAnimation() {
        const fields = [];
        const from = this.fstatus;
        const to = this.tstatus;
        const start = ~~(this.appeartime / 1000 * fps);
        const duration = ~~(this.duration / 1000 * fps);
        const canvas = this.canvas;
        const table = canvas.itemTables;
        const index = this.index;

        for (const field of from) {
            if (to.hasOwnProperty(field)) {
                fields.push(field);
            }
        }

        for (let i = 0; i < fields.length; ++i) {
            const field = fields[i];
            if (!isNaN(from[field]) && !isNaN(to[field])) {
                // so both two value are Number
            } else {
                fields.splice(i, 1);
                --i;
            }
        }

        while (start + duration >= table.length) {
            table.length.push(new Array());
        }
        for (let t = 0; t <= duration; ++t) {
            const item = new Item(this);
            for (const field of fields) {
                item[field] = (from[field] * (duration - t) + to[field] * t) / duration;
            }
            table[start + t][index] = item;
        }
    }

    appear(_) {
        this.appeartime = _;
        if (this.appeartime !== null && this.fstatus !== null && this.tstatus !== null && this.duration !== null) {
            this.createAnimation();
        }
        return this;
    }

    from(_) {
        this.fstatus = _;
        if (this.appeartime !== null && this.fstatus !== null && this.tstatus !== null && this.duration !== null) {
            this.createAnimation();
        }
        return this;
    }

    to(_) {
        this.tstatus = _;
        if (this.appeartime !== null && this.fstatus !== null && this.tstatus !== null && this.duration !== null) {
            this.createAnimation();
        }
        return this;
    }

    duration(_) {
        this.duration = _;
        if (this.appeartime !== null && this.fstatus !== null && this.tstatus !== null && this.duration !== null) {
            this.createAnimation();
        }
        return this;
    }

    createAppearAnimation() {

    }

    createDisappearAnimation() {
        
    }
}

/*

export function Canvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = this.ctx.createImageData(canvas.width, canvas.height);
    this.width = canvas.width;
    this.height = canvas.height;
    this.eventListener = new Int16Array(this.width * this.height);
    this.Items = new Array();
    this.render = () => {
        this.Items.forEach(item => {
            item.render(this);
        });
    };
    const frames = [];
    this.animation = (frame) => {
        frame = frame || 0;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.Items.forEach(item => {
            item.a += 1.0 / 30;
            if (item.a > 1) {
                item.a = 1;
            }
        });
        this.render();
        if (frame < 30)
        setTimeout(this.animation, 10, frame + 1);
    };
    return this;
}

export function mergeItem(items) {
    const l =
        Array.concat(...items.map(item => item.lines))
            .sort((a, b) => {
                if (a.x !== b.x) {
                    return a.x - b.x;
                } else if (a.y1 !== b.y1) {
                    return a.y1 - b.y1;
                } else {
                    return a.y2 - b.y2;
                }
            });
    // need a merge processing here
    const lines = [];
    for (let i = 0; i < l.length; ++i) {
        lines.push(l[i]);
        while (lines.length > 1 &&
            lines[lines.length - 1].x === lines[lines.length - 2].x &&
            lines[lines.length - 1].y1 - lines[lines.length - 2].y2 < 20) {
                lines[lines.length - 2].y2 = lines[lines.length - 1].y2;
                lines.pop();
            }
    }
    
    const color = [0, 0, 0, 0];
    let n = 0;
    for (const item of items) {
        for (let i = 0; i < 4; ++i) {
            color[i] += (item.y2 - item.y1) * item.color[i];
        }
        n += item.y2 - item.y1;
    }
    for (let i = 0; i < 4; ++i) {
        color[i] /= n;
    }

    const self = new Item({
        lines,
        color,
    });

    return self;
}

export function Item(item) {
    this.points = item.points;
    this.lines = item.lines;
    this.color = item.color;
    const points = this.points;
    const lines = this.lines;

    let x0 = Number.MAX_SAFE_INTEGER;
    let y0 = Number.MAX_SAFE_INTEGER;
    let x1 = 0;
    let y1 = 0;

    if (!!points) {
        for (let i = 0; i < points.length; i += 2) {
            if (points[i] > x1) {
                x1 = points[i];
            } else if (points[i] < x0) {
                x0 = points[i];
            }
        }
        for (let i = 1; i < points.length; i += 2) {
            if (points[i] > y1) {
                y1 = points[i];
            } else if (points[i] < y0) {
                y0 = points[i];
            }
        }
    } else {
        for (const line of lines) {
            if (line.x > x1) {
                x1 = line.x;
            } else if (line.x < x0) {
                x0 = line.x;
            }
            if (line.y1 < y0) {
                y0 = line.y1;
            }
            if (line.y2 > y1) {
                y1 = line.y2;
            }
        }
    }

    this.x = x0;
    this.y = y0;
    this.w = x1 - x0;
    this.h = y1 - y0;
    this.a = 1;
    const w = this.w;
    const h = this.h;

    this.pointRender = (canvas) => {
        const width = canvas.width;
        const height = canvas.height;
        const data = canvas.data;
        const ctx = canvas.ctx;
        const rw = 1.0 / w * this.w;
        const rh = 1.0 / h * this.h;
        const r = this.color[0];
        const g = this.color[1];
        const b = this.color[2];
        const a = this.color[3] * this.a;
        for (let i = 0; i < points.length; i += 2) {
            const x = ~~((points[i] - x0) * rw + this.x);
            const y = ~~((points[i] - y0) * rh + this.y);
            const index = (x + y * width) << 2;
            data[index + 0] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
        }
        ctx.putImagedata(data, 0, 0);
    };
    this.lineRender = (canvas) => {
        const width = canvas.width;
        const height = canvas.height;
        const ctx = canvas.ctx;
        const rw = 1.0 / w * this.w;
        const rh = 1.0 / h * this.h;
        const r = this.color[0];
        const g = this.color[1];
        const b = this.color[2];
        const a = this.color[3] * this.a;
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
        for (const line of lines) {
            const x = ~~((line.x - x0) * rw + this.x);
            const y1 = ~~((line.y1 - y0) * rh + this.y);
            const y2 = ~~((line.y2 - y0) * rh + this.y);
            ctx.beginPath();  
            ctx.moveTo(x, y1 - 1);
            ctx.lineTo(x, y2 + 1);
            ctx.stroke();
            ctx.closePath();  
        }
    };
    this.render = (canvas) => {
        if (!!points) {
            this.pointRender(canvas);
        } else {
            this.lineRender(canvas);
        }
    };
    return this;
}


export function Canvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = this.ctx.createImageData(canvas.width, canvas.height);
    this.width = canvas.width;
    this.height = canvas.height;
    this.eventListener = new Int16Array(this.width * this.height);
    this.Items = new Array();
    this.render = () => {
        this.Items.forEach(item => {
            item.render(this);
        });
    };
    const frames = [];
    this.animation = (frame) => {
        frame = frame || 0;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.Items.forEach(item => {
            item.a += 1.0 / 30;
            if (item.a > 1) {
                item.a = 1;
            }
        });
        this.render();
        if (frame < 30)
        setTimeout(this.animation, 10, frame + 1);
    };
    return this;
}

export function mergeItem(items) {
    const l =
        Array.concat(...items.map(item => item.lines))
            .sort((a, b) => {
                if (a.x !== b.x) {
                    return a.x - b.x;
                } else if (a.y1 !== b.y1) {
                    return a.y1 - b.y1;
                } else {
                    return a.y2 - b.y2;
                }
            });
    // need a merge processing here
    const lines = [];
    for (let i = 0; i < l.length; ++i) {
        lines.push(l[i]);
        while (lines.length > 1 &&
            lines[lines.length - 1].x === lines[lines.length - 2].x &&
            lines[lines.length - 1].y1 - lines[lines.length - 2].y2 < 20) {
                lines[lines.length - 2].y2 = lines[lines.length - 1].y2;
                lines.pop();
            }
    }
    
    const color = [0, 0, 0, 0];
    let n = 0;
    for (const item of items) {
        for (let i = 0; i < 4; ++i) {
            color[i] += (item.y2 - item.y1) * item.color[i];
        }
        n += item.y2 - item.y1;
    }
    for (let i = 0; i < 4; ++i) {
        color[i] /= n;
    }

    const self = new Item({
        lines,
        color,
    });

    return self;
}

export function Item(item) {
    this.points = item.points;
    this.lines = item.lines;
    this.color = item.color;
    const points = this.points;
    const lines = this.lines;

    let x0 = Number.MAX_SAFE_INTEGER;
    let y0 = Number.MAX_SAFE_INTEGER;
    let x1 = 0;
    let y1 = 0;

    if (!!points) {
        for (let i = 0; i < points.length; i += 2) {
            if (points[i] > x1) {
                x1 = points[i];
            } else if (points[i] < x0) {
                x0 = points[i];
            }
        }
        for (let i = 1; i < points.length; i += 2) {
            if (points[i] > y1) {
                y1 = points[i];
            } else if (points[i] < y0) {
                y0 = points[i];
            }
        }
    } else {
        for (const line of lines) {
            if (line.x > x1) {
                x1 = line.x;
            } else if (line.x < x0) {
                x0 = line.x;
            }
            if (line.y1 < y0) {
                y0 = line.y1;
            }
            if (line.y2 > y1) {
                y1 = line.y2;
            }
        }
    }

    this.x = x0;
    this.y = y0;
    this.w = x1 - x0;
    this.h = y1 - y0;
    this.a = 1;
    const w = this.w;
    const h = this.h;

    this.pointRender = (canvas) => {
        const width = canvas.width;
        const height = canvas.height;
        const data = canvas.data;
        const ctx = canvas.ctx;
        const rw = 1.0 / w * this.w;
        const rh = 1.0 / h * this.h;
        const r = this.color[0];
        const g = this.color[1];
        const b = this.color[2];
        const a = this.color[3] * this.a;
        for (let i = 0; i < points.length; i += 2) {
            const x = ~~((points[i] - x0) * rw + this.x);
            const y = ~~((points[i] - y0) * rh + this.y);
            const index = (x + y * width) << 2;
            data[index + 0] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
        }
        ctx.putImagedata(data, 0, 0);
    };
    this.lineRender = (canvas) => {
        const width = canvas.width;
        const height = canvas.height;
        const ctx = canvas.ctx;
        const rw = 1.0 / w * this.w;
        const rh = 1.0 / h * this.h;
        const r = this.color[0];
        const g = this.color[1];
        const b = this.color[2];
        const a = this.color[3] * this.a;
        ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
        for (const line of lines) {
            const x = ~~((line.x - x0) * rw + this.x);
            const y1 = ~~((line.y1 - y0) * rh + this.y);
            const y2 = ~~((line.y2 - y0) * rh + this.y);
            ctx.beginPath();  
            ctx.moveTo(x, y1 - 1);
            ctx.lineTo(x, y2 + 1);
            ctx.stroke();
            ctx.closePath();  
        }
    };
    this.render = (canvas) => {
        if (!!points) {
            this.pointRender(canvas);
        } else {
            this.lineRender(canvas);
        }
    };
    return this;
}

*/
