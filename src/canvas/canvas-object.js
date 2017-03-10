const fps = 20;

export class TCanvas {
    constructor(canvas, width, height) {
        width = width || canvas.width;
        height = height || canvas.height;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.items = new Array();
        this.itemTables = new Array();
    }

    clear() {
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;
        ctx.clearRect(0, 0, width, height);  
    }

    addItem(item) {
        const items = this.items;
        item.index = items.length;
        item.canvas = this;
        items.push(item);
    }

    render(timestamp) {
        timestamp = timestamp || 0;
        const items = this.itemTables[timestamp];
        const canvas = this.canvas;
        this.clear();
        for (const item of items) {
            item.render(this);
        }
    }
}

export class TItem {
    constructor(_) {
        let lines, color;
        if (_ instanceof Array) {
            const items = _;
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

            lines = [];
            for (let i = 0; i < l.length; ++i) {
                lines.push(l[i]);
                let n = lines.length;
                while (n > 1 && lines[n - 1].x === lines[n - 2].x && lines[n - 1].y1 - lines[n - 2].y2 < 20) {
                    lines[n - 2].y2 = lines[n - 1].y2;
                    --n;
                    lines.pop();
                }
            }
            
            color = [0, 0, 0];
            let cnt = 0;
            for (const item of items) {
                for (let i = 0; i < 3; ++i) {
                    color[i] += (item.y2 - item.y1) * item.color[i];
                }
                cnt += item.y2 - item.y1;
            }
            for (let i = 0; i < 3; ++i) {
                color[i] /= cnt;
            }

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
        } else if (!(_ instanceof TItem)) {
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

    createAnimation() {
        const fields = [];
        const from = this.fstatus;
        const to = this.tstatus;
        const start = this.appeartime;
        const duration = this.duration;
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
            const item = new TItem(this);
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
