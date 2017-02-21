import * as color from "../utils/color.js";
import { offset } from "../utils/common-utils.js";
import { decompose } from "../algorithm/decompose.js";
import { compose, findGroup } from "../algorithm/compose.js";
import color_space_divide from "../algorithm/color-space-divide.js";
import { random_sampling_seq } from "../algorithm/sampling.js";

let pixelgroup, groups, maxtimestamp, currenttime, lastgroup;
let initalData, transparentData, displayData;
let zoom_ratio;

function preprocessing(canvas) {
	const start_time = new Date();

	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;

	const imgData = ctx.getImageData(0, 0, width, height);
	const data = imgData.data;
	initalData = imgData;
	displayData = ctx.createImageData(width, height);
	const hsl_data = new Float32Array(width * height * 3);
	console.log(`time used: ${(new Date()).getTime() - start_time.getTime()} ms`);

	const seq = random_sampling_seq(height * width);
	for (let i = 0; i < height * width; ++i) {
		const r = data[(i << 2) + 0];
		const g = data[(i << 2) + 1];
		const b = data[(i << 2) + 2];
		const hsl = color.rgbToHsl(r, g, b);
		hsl_data[i * 3 + 0] = hsl[0];
		hsl_data[i * 3 + 1] = hsl[1];
		hsl_data[i * 3 + 2] = hsl[2];
	}
	for (let i = 0; i < seq.length; ++i) {
		const t = seq[i] * 3;
		seq[i] = [hsl_data[t], hsl_data[t + 1], hsl_data[t + 2]];
	}
	const color2tag = color_space_divide(seq);
	const count = [];
	for (let i = 0; i < height * width * 3; i += 3) {
		const tag = color2tag([hsl_data[i], hsl_data[i + 1], hsl_data[i + 2]]);
		if (!count[tag]) {
			count[tag] = 0;
		}
		count[tag] += 1;
	}
	console.log(count);

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
		return {};
    },
	props: ['src', 'width', 'height'],

	/*
	methods: {
		onClick(event) {
		},
		onMousemove(event) {
		},
		onMouseout(event) {
		}
	},
		*/
	methods: {
		onClick(event) {
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const canvas2 = this.$el.getElementsByTagName('canvas')[1];
			const x = Math.floor((event.pageX - offset.x(canvas)) * zoom_ratio);
			const y = Math.floor((event.pageY - offset.y(canvas)) * zoom_ratio);
			const width = canvas.width;
			const height = canvas.height;
			const group = pixelgroup[y * canvas.width + x];
			console.log(group.color, group.centroid, color.rgbToHsl(
				initalData.data[(y * canvas.width + x) * 4 + 0],
				initalData.data[(y * canvas.width + x) * 4 + 1],
				initalData.data[(y * canvas.width + x) * 4 + 2]
			));
			// const k = y * canvas.width + x << 2;
			// const hsl = color.rgbToHsl(initalData.data[k + 0], initalData.data[k + 1], initalData.data[k + 2]);
			// console.log(hsl);
			// console.log(x, y, event);
			
			let group0 = pixelgroup[y * canvas.width + x];
			if (group0 != null) {
				group0 = findGroup(group0, currenttime);
				if (!group0.checked) {
					group0.checked = true;
				} else {
					group0.checked = false;
				}
				const width = canvas.width;
				const height = canvas.height;
/*
				const points = group0.points;
				for (let i = 0; i < points.length; i += 2) {
					imgData.data[((points[i + 1] * width + points[i]) << 2) + 3] = 255;
				}

				for (const group of group0.neighbor) {
					//if (findGroup(group, currenttime) === group0) {
					const points = group.points;
					for (let i = 0; i < points.length; i += 2) {
						imgData.data[((points[i + 1] * width + points[i]) << 2) + 3] = 255;
					}
				}
				*/
				
				for (const group of groups) {
					if (findGroup(group, currenttime) === group0) {
						const points = group.points;
						for (let i = 0; i < points.length; i += 2) {
							displayData.data[((points[i + 1] * width + points[i]) << 2) + 0] =
							initalData.data[((points[i + 1] * width + points[i]) << 2) + 0];
							displayData.data[((points[i + 1] * width + points[i]) << 2) + 1] =
							initalData.data[((points[i + 1] * width + points[i]) << 2) + 1];
							displayData.data[((points[i + 1] * width + points[i]) << 2) + 2] =
							initalData.data[((points[i + 1] * width + points[i]) << 2) + 2];
							displayData.data[((points[i + 1] * width + points[i]) << 2) + 3] = group0.checked ? 255 : 0;
						}
					}
				}
			}
				
			const ctx = canvas2.getContext('2d');
			ctx.putImageData(displayData, 0, 0);
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
/*
				const points = group0.points;
				for (let i = 0; i < points.length; i += 2) {
					imgData.data[((points[i + 1] * width + points[i]) << 2) + 3] = 255;
				}

				for (const group of group0.neighbor) {
					//if (findGroup(group, currenttime) === group0) {
					const points = group.points;
					for (let i = 0; i < points.length; i += 2) {
						imgData.data[((points[i + 1] * width + points[i]) << 2) + 3] = 255;
					}
				}
				*/
				
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
		}
	},
	
	mounted() {
		const canvas = this.$el.getElementsByTagName('canvas')[0];
		const canvas2 = this.$el.getElementsByTagName('canvas')[1];
		const ctx = canvas.getContext('2d');
		const img = new Image();
		img.src = this.src;
		img.onload = function() {
			canvas.width = img.width;
			canvas.height = img.height;
			zoom_ratio = Math.max(img.width / 1280, img.height / 800); 
			console.log(zoom_ratio);
			ctx.drawImage(img, 0, 0);
			preprocessing(canvas);	
			canvas2.width = img.width;
			canvas2.height = img.height;
		};
	}
};