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
    };
    this.lineRender = (canvas) => {
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

export function ItemSet(items) {
    this.items = items.map((item) => (new Item(item)));
    const x = Math.min(...items.map(item => item.x));
    const w = Math.max(...items.map(item => item.x)) - this.x;
    const y = Math.min(...items.map(item => item.y));
    const h = Math.max(...items.map(item => item.y)) - this.y;
    this.x = x;
    this.w = w;
    this.y = y;
    this.h = h;
    this.a = 1;
    this.render = (canvas) => {
        this.items.forEach((item) => {
            item.a = this.a;
            item.render(canvas);
        });
    };
    return this;
}
