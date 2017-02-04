import * as color from "../utils/color.js";

export default function color_space_divide(data, options = {}) {
    const base = options.base || 60;
    const sqr_base = base * base;
    const n = base - 1;
    const Int = (d) => Math.ceil((d - Number.EPSILON) * n);
    const order = options.dimension_order || [0, 1, 2];
    const threshold_dimension =
        options.main_part_proportion || [0.95, 0.95, 0.9];
    const total_len = data.length;
    const min_space_size = 0.001 * total_len;
    let tag_num = 0;
    const spaces = [];

    function divide(data, k = 0, last = 0) {
        const d = order[k];
        const count = new Array(base);        
        for (let i = 0; i < base; ++i) {
            count[i] = 0;
        }
        for (const val of data) {
            count[val[d]] += 1;
        }

        const ordered_count = 
            count.map((d, i) => [d, i])
                .sort((a, b) => (b[0] - a[0]));
        const lbound = threshold_dimension[d] * data.length;

        let sum = 0;
        let border = [], centroid = []; // point === split point
        if (data.length < min_space_size) {
            border.push(n);
        } else {
            for (let i = 0; i < ordered_count.length; ++i) {
                sum += ordered_count[i][0];
                border.push(ordered_count[i][1]);
                if (sum >= lbound) {
                    break;
                }
            }
            border = border.sort((a, b) => a - b);
            for (let i = 0; i < border.length - 1; ++i) {
                if (border[i] + 1 === border[i + 1]) {
                    border[i] = -1;
                } else {
                    border[i] = (border[i] + border[i + 1]) >> 1;
                }
            }
            border[border.length - 1] = n;
            border = border.filter(d => d >= 0);
        }

        for (let i = 0; i < border.length; ++i) {
            let p = 0, q = 0;
            for (let j = i ? border[i - 1] + 1 : 0; j <= border[i]; ++j) {
                p += count[j] * j;
                q += count[j];
            }
            centroid.push(Math.ceil(p / q));
        }

        if (k === 2) {
            const tag = new Array(border.length);
            for (let i = 0; i < border.length; ++i) {
                tag[i] = tag_num;
                spaces.push({
                    color: last * base + centroid[i],
                    size: count[centroid[i]],
                    index: tag_num
                });
                tag_num++;
            }
            return g => {
                for (let i = 0; i < border.length; ++i) {
                    if (g[d] <= border[i]) {
                        return tag[i];
                    }
                }
            };
        } else {
            const next = new Array(border.length);
            const data_radix = new Array(base);
            for (let i = 0; i < base; ++i) {
                data_radix[i] = [];
            }
            for (const g of data) {
                data_radix[g[d]].push(g);
            }
            const data_slice = (lo, hi) => {
                return Array.concat(...data_radix.slice(lo, hi));
            };

            for (let i = 0; i < border.length; ++i) {
                next[i] = divide(
                    data_slice(i ? (border[i - 1] + 1) : 0, border[i] + 1),
                    k + 1,
                    last * base + centroid[i]
                );
            }

            return g => {
                for (let i = 0; i < border.length; ++i) {
                    if (g[d] <= border[i]) {
                        return next[i](g);
                    }
                }
            };
        }
    }

    data = data.map(d => ([
        Math.ceil(d[0] * n),
        Math.ceil(d[1] * n),
        Math.ceil(d[2] * n),
    ]));

    const f = divide(data);
    const cache = new Int16Array(base * base * base + 1);
    spaces.sort((a, b) => (b.size - a.size));
    const h = new Array(spaces.length);
    for (let i = 0; i < spaces.length; ++i) {
        h[spaces[i].index] = i;
    }
    for (const t of spaces) {
        const h = Math.floor(t.color / sqr_base) / base;
        const s = Math.floor(t.color % sqr_base / base) / base;
        const l = t.color % base / base;
        const c = color.hslToRgb(h, s, l);
        t.hsl = `hsl(${h.toFixed(3)},${s.toFixed(3)},${l.toFixed(3)})`;
        t.rgb = `rgb(${c[0] + Number.EPSILON >> 0},${c[1] + Number.EPSILON >> 0},${c[2] + Number.EPSILON >> 0})`;
        // console.log(t.color);
    }

    return {
        color2tag: (g) => {
            g = g.map(d => Math.ceil(d * n));
            const index = g[0] * sqr_base + g[1] * base + g[2];
            if (cache[index] !== 0) {
                return cache[index];
            } else {
                return cache[index] = h[f(g)];
            }
        },
        tag2rgb: (g) => {
            return spaces[g].rgb;
        },
        tag2hsl: (g) => {
            return spaces[g].hsl;
        },
        tagcount: tag_num
    };
}