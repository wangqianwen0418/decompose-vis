<template>
	<div class="vis-figure">
		<canvas @mouseout="onMouseout" @mousemove="onMousemove">
		</canvas>
	</div>
</template>

<script>

function offsetX(d) {
	if (d === null) {
		return 0;
	} else {
		return d.offsetLeft + offsetX(d.offsetParent);
	}
}
function offsetY(d) {
	if (d === null) {
		return 0;
	} else {
		return d.offsetTop + offsetY(d.offsetParent);
	}
}

let connectivityTag, isBorderLine, initalData, outerBox;

function connectivityDetection(data, width, height) {
	const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
	const jumpDirections = [[-8, 0], [8, 0], [0, -8], [0, 8]];
	const connectivityTag = new Uint16Array(width * height);
	const Q = new Array(width * height >> 3);
	let currentTag = 0;
	console.log(data);

	const threshold0 = 2;
	const threshold1 = 20;
	outerBox = [null];

	for (let i = 0; i < height; ++i) {
		for (let j = 0; j < width; ++j) if (!connectivityTag[i * width + j]) {
			connectivityTag[i * width + j] = ++currentTag;
			let minX = i,
				minY = j,
				maxX = i,
				maxY = j;
			let head = 0, tail = -1;
			/*let r = data[(i * width + j) + 0],
				g = data[(i * width + j) + 1],
				b = data[(i * width + j) + 2];
				*/
			Q[++tail] = [i, j];
			
			while (head <= tail) {
				const x0 = Q[head][0];
				const y0 = Q[head][1];
				if (x0 > maxX) maxX = x0;
				if (x0 < minX) minX = x0;
				if (y0 > maxY) maxY = y0;
				if (y0 < minY) minY = y0;

				const z0 = (x0 * width + y0) << 2;
				//const ar = r / (tail + 1) >> 0;
				//const ag = g / (tail + 1) >> 0;
				//const ab = b / (tail + 1) >> 0;
				++head;

				for (let k = 0; k < directions.length; ++k) {
					const x1 = x0 + directions[k][0];
					const y1 = y0 + directions[k][1];
					if (x1 < 0 || x1 >= height || y1 < 0 || y1 >= width) continue;
					const z1 = (x1 * width + y1) << 2;
					if (connectivityTag[z1 >> 2] !== 0) continue;
					if (Math.abs(data[z0 + 0] - data[z1 + 0]) < threshold0 &&
						Math.abs(data[z0 + 1] - data[z1 + 1]) < threshold0 &&
						Math.abs(data[z0 + 2] - data[z1 + 2]) < threshold0 
						//&& Math.abs(ar - data[z1 + 0]) < threshold1
						//&& Math.abs(ag - data[z1 + 1]) < threshold1
						//&& Math.abs(ab - data[z1 + 2]) < threshold1
						) {
							Q[++tail] = [x1, y1];
							connectivityTag[z1 >> 2] = currentTag;
							//r += data[z1 + 0];
							//g += data[z1 + 1];
							//b += data[z1 + 2];
						}
				}

				for (let k = 0; k < jumpDirections.length; ++k) {
					const x1 = x0 + jumpDirections[k][0];
					const y1 = y0 + jumpDirections[k][1];
					if (x1 < 0 || x1 >= height || y1 < 0 || y1 >= width) continue;
					const z1 = (x1 * width + y1) << 2;
					if (connectivityTag[z1 >> 2] !== 0) continue;
					if (Math.abs(data[z0 + 0] - data[z1 + 0]) < threshold0 &&
						Math.abs(data[z0 + 1] - data[z1 + 1]) < threshold0 &&
						Math.abs(data[z0 + 2] - data[z1 + 2]) < threshold0
					){
							Q[++tail] = [x1, y1];
							connectivityTag[z1 >> 2] = currentTag;
						}
				}
			}
			outerBox.push({
				x0 : minX,
				x1 : maxX,
				y0 : minY,
				y1 : maxY,
			});
		}
	}
	return connectivityTag;
}

function pretreatment(canvas) {
	const last = new Date();

	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;

	const imgData = ctx.getImageData(0, 0, width, height);
	const data = imgData.data;
	initalData = imgData;

	connectivityTag = connectivityDetection(data, width, height);
	isBorderLine = new Uint8Array(width * height);

	for (let i = 0; i < height; ++i) {
		for (let j = 0; j < width; ++j) {
			const tag = connectivityTag[i * width + j];
			isBorderLine[i * width + j] = 
				(i > 0 && connectivityTag[(i - 1) * width + j] !== tag) ||
				(j > 0 && connectivityTag[(i) * width + j - 1] !== tag) ||
				(i + 1 < height && connectivityTag[(i + 1) * width + j] !== tag) ||
				(j + 1 < width && connectivityTag[(i) * width + j + 1] !== tag);
		}
	}

	console.log(`time used: ${(new Date()).getTime() - last.getTime()} ms`);
}

let lastTag = -1;

export default {
    data() {
		return {}
    },
	props: ['src', 'width', 'height'],
	methods: {
		onMousemove(event) {
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			const x = event.clientX - offsetX(canvas);
			const y = event.clientY - offsetY(canvas);
			const tag = connectivityTag[y * canvas.width + x];
			if ((tag === 1 && lastTag > 0) || (tag !== 1 && tag !== lastTag)) {
				const last = new Date();
				ctx.putImageData(initalData, 0, 0);
				const width = canvas.width;
				const height = canvas.height;
				const imgData = ctx.getImageData(0, 0, width, height);
				const dark = 255;
				const light = tag === 1 ? 255 : 50;
				for (let i = 0; i < height; ++i) {
					for (let j = 0; j < width; ++j) if (connectivityTag[i * width + j] === tag) {
						imgData.data[((i * width + j) << 2) + 3] = dark;
						if (false && isBorderLine[i * width + j]) {
							imgData.data[((i * width + j) << 2) + 0] =
							imgData.data[((i * width + j) << 2) + 1] =
							imgData.data[((i * width + j) << 2) + 2] =
							0;
						}
					} else {
						imgData.data[((i * width + j) << 2) + 3] = light;
					}
				}

				ctx.putImageData(imgData, 0, 0);
				return;
				for (let i = 1; i < outerBox.length; ++i) {
					const box = outerBox[i];
					if (outerBox[tag].x0 <= box.x0 && box.x1 <= outerBox[tag].x1 &&
					outerBox[tag].y0 <= box.y0 && box.y1 <= outerBox[tag].y1) {
						ctx.beginPath();
						ctx.strokeStyle = 'red';
						ctx.lineWidth = 1.5;
						ctx.moveTo(box.y0, box.x0);
						ctx.lineTo(box.y0, box.x1);
						ctx.lineTo(box.y1, box.x1);
						ctx.lineTo(box.y1, box.x0);
						ctx.lineTo(box.y0, box.x0);
						ctx.stroke();
					}
				}

				console.log(`time used: ${(new Date()).getTime() - last.getTime()} ms`);
			}
		},
		onMouseout(event) {
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			lastTag = -1;
			ctx.putImageData(initalData, 0, 0);
		}
	},
	mounted() {
		const canvas = this.$el.getElementsByTagName('canvas')[0];
		const ctx = canvas.getContext('2d');
		const img = new Image();
		img.src = this.src;
		img.onload = function() {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			pretreatment(canvas);
		};
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.vis-figure {
		position: relative; 
		top: 10px;
		left: 10px;
	}
</style>
