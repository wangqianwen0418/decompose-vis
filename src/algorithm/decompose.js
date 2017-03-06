export function decompose(data, width, height, gradient = [0.02, 0.02, 0.01]) {
	const directions = [[-1, 0], [1, 0], [0, -1], [0, 1],
		[-1, -1], [-1, 1], [1, -1], [1, 1],
		[-2, -2], [2, 2], [2, -2], [-2, 2],
		[3, 0], [-3, 0], [0, 3], [0, -3],
		[-4, 2], [4, -2], [-2, -4], [2, 4],
		//[-4, 0], [4, 0], [0, -4], [0, 4],
		//[-7, 0], [7, 0], [0, -7], [0, 7],
		//[-10, 0], [10, 0], [0, -10], [0, 10],
		];
	const nth = new Uint32Array(width * height);
	const Queue = new Array(width * height >> 3);
	let current_num = 0;
    const elements = [];
	const hash = [];

	for (let i = 0; i < width; ++i) {
		for (let j = 0; j < height; ++j) if (nth[j * width + i] === 0) {
			nth[j * width + i] = ++current_num;
			let head = 0;
            let tail = -1;
            let sc0 = 0;
            let sc1 = 0;
            let sc2 = 0;
			let sx = 0;
			let sy = 0;
			Queue[++tail] = [i, j];

			while (head <= tail) {
				const x0 = Queue[head][0];
				const y0 = Queue[head][1];
				const z0 = (y0 * width + x0) * 3;
				const d0 = data[z0 + 0];
				const d1 = data[z0 + 1];
				const d2 = data[z0 + 2];
                sc0 += d0; sc1 += d1; sc2 += d2;
				sx += x0; sy += y0;
				++head;

				for (let k = 0; k < directions.length; ++k) {
					const x1 = x0 + directions[k][0];
					const y1 = y0 + directions[k][1];
					if (x1 < 0 || x1 >= width || y1 < 0 || y1 >= height) continue;
					const z1 = (y1 * width + x1) * 3;
					if (nth[y1 * width + x1] !== 0) continue;
					if (Math.abs(d0 - data[z1 + 0]) <= gradient[0] &&
						Math.abs(d1 - data[z1 + 1]) <= gradient[1] &&
                    	Math.abs(d2 - data[z1 + 2]) <= gradient[2]) {
							Queue[++tail] = [x1, y1];
							nth[y1 * width + x1] = current_num;
						}
				}
			}
			const n = tail + 1;

            if (n >= 10) {
				const points = new Int16Array(n * 2);
				for (let i = 0; i <= tail; ++i) {
					points[(i << 1)] = Queue[i][0];
					points[(i << 1) + 1] = Queue[i][1];
				}
                elements.push({
                    points,
                    color: [sc0 / n, sc1 / n, sc2 / n],
					centroid: [sx / n, sy / n],
					tag: current_num,
                });
				hash[current_num] = elements[elements.length - 1];
            }
		}
	}

	for (let i = 0; i < width; ++i) {
		let last = 0;
		for (let j = 1; j <= height; ++j) {
			if (j === height || nth[j * width + i] !== nth[j * width + i - width]) {
				const e = hash[nth[last * width + i]];
				if (!e) {
					last = j;
					continue;
				}
				if (!e.lines) {
					e.lines = [];
				}
				e.lines.push({
					x: i,
					y1: last,
					y2: j - 1
				});
				if (e.lines.length > 1 && e.lines[e.lines.length - 1].x === e.lines[e.lines.length - 2].x) {
					if (e.lines[e.lines.length - 2].y2 + 40 >= e.lines[e.lines.length - 1].y1) {
						e.lines[e.lines.length - 2].y2 = e.lines[e.lines.length - 1].y2;
						e.lines.pop();
					}
				}
				last = j;
			}
		}
	}

	return {
		elements,
		group: nth,
	};
}
