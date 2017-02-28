function Canvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = ctx.createImageData(canvas.width, canvas.height);
    this.width = canvas.width;
    this.height = canvas.height;
    this.eventListener = new Int16Array(width * height);
    this.Objects = new Array();
    return this;
}

function Item(item) {
    this.points = item.points;
    this.color = item.color;
    const points = this.points;

    let x0 = Number.MAX_SAFE_INTEGER;
    let y0 = Number.MAX_SAFE_INTEGER;
    let x1 = 0;
    let y1 = 0;

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

    this.x = x0;
    this.y = y0;
    this.w = x1 - x0;
    this.h = y1 - y0;
    this.a = 1;
    const w = this.w;
    const h = this.h;

    this.render = (canvas) => {
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
    return this;
}

function CanvasObject(items) {
    this.items = items.map((item) => (new Item(item)));
    this.render = (canvas) => {
        this.items.forEach((item) => {
            item.render(canvas);
        });
    };
    return this;
}
