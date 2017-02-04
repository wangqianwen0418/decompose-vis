<template>
	<div class="vis-figure">
		<el-row>
			<el-col :span="24">
				<canvas @mouseout="onMouseout" @mousemove="onMousemove" @click="onClick" @mouseenter="onMouseenter">
				</canvas>
			</el-col>
		</el-row>
		<el-row>
			<el-col :span="3" v-for="item in color_spaces">
				<div class="circle-button"
					@mouseenter="onButtonMouseenter"
					@mouseout="onButtonMouseout"
					:tag=item.index :style=item.style>
					<br><br><br>{{item.text}}
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script type="text/javascript">
import * as color from "../utils/color.js";
import { offset } from "../utils/common-utils.js";
import { decompose } from "../algorithm/decompose.js";
import { compose, findGroup } from "../algorithm/compose.js";
import color_space_divide from "../algorithm/color-space-divide.js";
import { random_sampling_seq } from "../algorithm/sampling.js";
import * as d3 from "d3";

let pixelgroup, groups, maxtimestamp, currenttime, lastgroup, tags;
let initalData, transparentData, color_spaces = [];
let zoom_ratio, svg;

function preprocessing(canvas) {
	const start_time = new Date();

	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;

	const imgData = ctx.getImageData(0, 0, width, height);
	const data = imgData.data;
	initalData = imgData;
	const hsl_data = new Float32Array(width * height * 3);
	console.log(`time used: ${(new Date()).getTime() - start_time.getTime()} ms`);

	const seq = random_sampling_seq(height * width);
	for (let i = 0; i < height * width; ++i) {
		let r = data[(i << 2) + 0];
		let g = data[(i << 2) + 1];
		let b = data[(i << 2) + 2];
		const a = data[(i << 2) + 3];
		if (a !== 255) {
			r = Math.floor(r / 255 * a);
			g = Math.floor(g / 255 * a);
			b = Math.floor(b / 255 * a);
			data[(i << 2) + 0] = r;
			data[(i << 2) + 1] = g;
			data[(i << 2) + 2] = b;
			data[(i << 2) + 3] = 255;
		}
		const hsl = color.rgbToHsl(r, g, b);
		hsl_data[i * 3 + 0] = hsl[0];
		hsl_data[i * 3 + 1] = hsl[1];
		hsl_data[i * 3 + 2] = hsl[2];
	}
	for (let i = 0; i < seq.length; ++i) {
		const t = seq[i] * 3;
		seq[i] = [hsl_data[t], hsl_data[t + 1], hsl_data[t + 2]];
	}
	const division = color_space_divide(seq);
	const color2tag = division.color2tag;
	console.log(division.tagcount);
	const count = [];
	tags = new Uint16Array(width * height);
	for (let i = 0; i < height * width * 3; i += 3) {
		const tag = color2tag([hsl_data[i], hsl_data[i + 1], hsl_data[i + 2]]);
		if (!count[tag]) {
			count[tag] = 0;
		}
		count[tag] += 1;
		tags[i / 3] = tag;
	}
	console.log(count);
	for (let i = 0; i < count.length; ++i) if (count[i] / (width * height) * 100 > 0.5) {
		color_spaces.push({
			text: `${(count[i] / (width * height) * 100).toFixed(2)}%\n
				${i === 0 ? 'background' : division.tag2hsl(i)}`,
			style: {
				background: division.tag2rgb(i)
			},
			index: i
		});
	}
	console.log(color_spaces);

	console.log(`rgbtoHsl: ${(new Date()).getTime() - start_time.getTime()} ms`);
	const decomposed = decompose(hsl_data, width, height);
	console.log(`decompose: ${(new Date()).getTime() - start_time.getTime()} ms`);
	const elements = compose(decomposed.elements, width, height);
	console.log(`compose: ${(new Date()).getTime() - start_time.getTime()} ms`);
	pixelgroup = new Array(width * height);

	groups = elements;
	for (const element of elements) {
		const points = element.points;
		for (let i = 0; i < points.length; i += 2) {
			pixelgroup[points[i] + points[i + 1] * width] = element;
		}
		if (element.timestamp > maxtimestamp) {
			maxtimestamp = element.timestamp;
		}
	}

	currenttime = maxtimestamp;
	ctx.putImageData(imgData, 0, 0);
	transparentData = ctx.getImageData(0, 0, width, height);
	console.log(`total time used: ${(new Date()).getTime() - start_time.getTime()} ms`);
}

export default {
    data() {
		return {
			color_spaces
		};
    },
	props: ['src', 'width', 'height'],
	methods: {
		onClick(event) {
			const start_time = new Date();
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			const x = Math.floor((event.pageX - offset.x(canvas)) * zoom_ratio);
			const y = Math.floor((event.pageY - offset.y(canvas)) * zoom_ratio);
			// const k = y * canvas.width + x << 2;
			// const hsl = color.rgbToHsl(initalData.data[k + 0], initalData.data[k + 1], initalData.data[k + 2]);
			// console.log(hsl);
			// console.log(x, y, event);
			
			let group0 = pixelgroup[y * canvas.width + x];
			const top = [], btm = [];
			const contour = [];

			if (group0 != null) {
				group0 = findGroup(group0, currenttime);
				const width = canvas.width;
				const height = canvas.height;
				
				let n = 0, r = 0, g = 0, b = 0, x0 = Number.MAX_VALUE, y0 = Number.MAX_VALUE, x1 = 0, y1 = 0;
				for (const group of groups) {
					if (findGroup(group, currenttime) === group0) {
						const points = group.points;
						for (let i = 0; i < points.length; i += 2) {
							const x = Math.floor(points[i] / zoom_ratio);
							const y = points[i + 1] / zoom_ratio;
							n += 1;
							r += transparentData.data[((points[i + 1] * width + points[i]) << 2) + 0];
							g += transparentData.data[((points[i + 1] * width + points[i]) << 2) + 1];
							b += transparentData.data[((points[i + 1] * width + points[i]) << 2) + 2];
							if (!btm[x]) {
								btm[x] = y;
							} else if (y > btm[x]) {
								btm[x] = y;
							}
							if (!top[x]) {
								top[x] = y;
							} else if (y < top[x]) {
								top[x] = y;
							}
							if (x < x0) {
								x0 = x;
							} else if (x > x1) {
								x1 = x;
							}
							if (y < y0) {
								y0 = y;
							} else if (y > y1) {
								y1 = y;
							}
						}
					}
				}
				r = Math.floor(r / n);
				g = Math.floor(g / n);
				b = Math.floor(b / n);

				for (var i = 0; i < top.length; ++i) if (top[i] !== undefined) {
					contour.push([i, top[i]]);
				}
				for (var i = btm.length - 1; i >= 0; --i) if (btm[i] !== undefined) {
					contour.push([i, btm[i]]);
				}
				contour.push(contour[0]);
				const line = d3.line().curve(d3.curveCardinal.tension(0.5)).x(d => d[0] - x0).y(d => d[1] - y0);
				const contour_sample = 
					contour.length < 100 ?
					contour :
					contour.filter((d, i) => i === 0 || i === (contour.length - 1) || (i % 8 === 0));

				d3.select(this.$el).selectAll("svg").remove();

				const svg = d3.select(this.$el)
					.append("svg");

				let left0 = -1, top0 = -1;

				svg.call(d3.drag()
						.on("start", function(d){
							const el = d3.select(this);
							left0 = parseInt(el.style('left'));
							top0 = parseInt(el.style('top'));
						})
						.on("drag", function(d){
							const el = d3.select(this);
							const left = parseInt(el.style('left'));
							const top = parseInt(el.style('top'));
							el.style('left', `${left + d3.event.dx}px`);
							el.style('top', `${top + d3.event.dy}px`);
						})
						.on("end", function(d){
							const el = d3.select(this);
							el.transition().duration(400)
								.style('left', `${left0}px`)
								.style('top', `${top0}px`);
						})
					);

				svg.attr("width", x1 - x0)
					.attr("height", y1 - y0);

				svg.append("path")
					.datum(contour_sample)
					.attr('d', line)
					.attr("stroke-width", 2)
					.attr("fill", `rgb(${r},${g},${b})`);

				svg.style("position", "absolute")
					.style("left", `${x0 + offset.x(canvas) - 10}px`)
					.style("top", `${y0}px`);
			}
			console.log(`click time used: ${(new Date()).getTime() - start_time.getTime()} ms`);
		},
		onMousemove(event) {
			const start_time = new Date();
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			const x = Math.floor((event.pageX - offset.x(canvas)) * zoom_ratio);
			const y = Math.floor((event.pageY - offset.y(canvas)) * zoom_ratio);
			// const k = y * canvas.width + x << 2;
			// const hsl = color.rgbToHsl(initalData.data[k + 0], initalData.data[k + 1], initalData.data[k + 2]);
			// console.log(hsl);
			// console.log(x, y, event);
			
			let group0 = pixelgroup[y * canvas.width + x];
			if (group0 != null) {
				group0 = findGroup(group0, currenttime);

				if (group0 === lastgroup) {
					return;
				}
				const width = canvas.width;
				const height = canvas.height;
				
				for (const group of groups) {
					if (findGroup(group, currenttime) === group0) {
						const points = group.points;
						for (let i = 0; i < points.length; i += 2) {
							transparentData.data[((points[i + 1] * width + points[i]) << 2) + 3] = 255;
						}
					} else if (findGroup(group, currenttime) === lastgroup) {
						const points = group.points;
						for (let i = 0; i < points.length; i += 2) {
							transparentData.data[((points[i + 1] * width + points[i]) << 2) + 3] = 30;
						}
					}
				}
				lastgroup = group0;

				ctx.putImageData(transparentData, 0, 0);
			}

			console.log(`time used: ${(new Date()).getTime() - start_time.getTime()} ms`);
		},
		onMouseenter(event) {
			console.log("mouseenter");
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			const width = canvas.width;
			const height = canvas.height;
			const data = transparentData.data;
			for (let i = 0; i < width * height; ++i) {
				data[(i << 2) + 3] = 30;
			}
			ctx.putImageData(transparentData, 0, 0);
		},
		onMouseout(event) {
			console.log("mouseout");
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			lastgroup = null;
			ctx.putImageData(initalData, 0, 0);
			const width = canvas.width;
			const height = canvas.height;
			const data = transparentData.data;
			for (let i = 0; i < width * height; ++i) {
				data[(i << 2) + 3] = 30;
			}
		},
		onButtonMouseenter(event) {
			const tag = ~~event.target.getAttribute("tag");
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			const width = canvas.width;
			const height = canvas.height;
			const data = transparentData.data;
			let count = 0;
			for (let i = 0; i < width * height; ++i) if (tags[i] === tag) {
				data[(i << 2) + 3] = 255;
				++count;

			} else {
				data[(i << 2) + 3] = 50;
			}
			console.log(tag, count);
			ctx.putImageData(transparentData, 0, 0);
		},
		onButtonMouseout(event) {
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			lastgroup = null;
			ctx.putImageData(initalData, 0, 0);
			const width = canvas.width;
			const height = canvas.height;
			const data = transparentData.data;
			for (let i = 0; i < width * height; ++i) {
				data[(i << 2) + 3] = 30;
			}
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
			zoom_ratio = Math.max(img.width / 1280, img.height / 800); 
			ctx.drawImage(img, 0, 0);
			preprocessing(canvas);
			//svg.attr('width', img.width / zoom_ratio)
			//	.attr('height', img.height / zoom_ratio);
		};
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	canvas {
		position: relative;
		left: 0px;
		top: 0px;
		max-width: 1280px;
		max-height: 800px;
	}
	.vis-figure {
		position: relative;
	}
    .circle-button {
        width: 130px;
        height: 130px;
		box-shadow: 5px 5px 3px #888888;
        text-align: center;
        border-radius: 65px;
        opacity: 0.6;
        font-size: 15px;
        font-family: sans-serif;
    }
    .circle-button:hover {
        opacity: 1.0;
    }
</style>
