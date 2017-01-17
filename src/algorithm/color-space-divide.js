export default function color_space_divide(data, options = {}) {
    const base = options.base || 60;
    const order = options.dimension_order || [0, 1, 2];
    const threshold_p = options.main_part_proportion || 0.95;
    let tag_num = 0;

    function divide(data, k = 0) {
        const d = order[k];
        const count = new Array(base + 1);
        for (let i = 0; i <= count; ++i) {
            count[i] = 0;
        }
        for (let i = 0; i < data; ++i) {
            count[data[i][d]] += 1;
        }
        const topk_count = count.map((d, i) => [d, i]).sort((a, b) => (b[0] - a[0]));
        const threshold = threshold_p * data.length;
        let sum = 0;

        const point = []; // point === split point
        for (let i = 0; i < topk_count.length; ++i) {
            sum += topk_count[i][0];
            point.push(topk_count[i][1]);
            if (sum >= threshold) {
                break;
            }
        }
        point.sort();
        
        for (let i = 0; i < point.length - 1; ++i) {
            point[i] = (point[i] + point[i + 1]) >> 1;
        }
        point.push(base);

        if (k === 2) {
            const tag = new Array(point.length);
            for (let i = 0; i < point.length; ++i) {
                tag[i] = ++tag_num;
            }
            return g => {
                for (let i = 0; i < point.length; ++i) {
                    if (g[d] <= point[i]) {
                        return tag[i];
                    }
                }
            };
        } else {
            const next = new Array(point.length);
            const data_radix = new Array(base + 1);
            for (const g of data) {
                data_radix[g[d]].push(g);
            }
            const data_slice = (lo, hi) => {
                return Array.concat(...data_radix.slice(lo, hi));
            };

            for (let i = 0; i < point.length; ++i) {
                next[i] = divide(data_slice(i ? (point[i - 1] + 1) : 0, point[i] + 1), k + 1);
            }

            return g => {
                for (let i = 0; i < point.length; ++i) {
                    if (g[d] <= point[i]) {
                        return next[i](g);
                    }
                }
            };
        }
    }

    data = data.map(d => ([
        Math.ceil(d[0] * base),
        Math.ceil(d[1] * base),
        Math.ceil(d[2] * base),
    ]));

    return divide(data);
}