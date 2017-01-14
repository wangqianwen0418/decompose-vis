import * as color from "../../utils/color.js";
import { offset } from "../../utils/common-utils.js";
import { decompose } from "../../algorithm/decompose.js";
import { compose, findGroup } from "../../algorithm/compose.js";

let pixelgroup, groups, maxtimestamp, currenttime, lastgroup;
let initalData, transparentData, displayData;
let zoom_ratio;

function pretreatment(canvas) {
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

	const h_count = new Array(60);
	for (let i = 0; i < 60; ++i) {
		h_count[i] = {
			count: 0,
			hsl: [0, 0, 0]
		};
	}

	for (let i = 0; i < height * width; ++i) {
		const r = data[(i << 2) + 0];// & 240;
		const g = data[(i << 2) + 1];// & 240;
		const b = data[(i << 2) + 2];// & 240;
		const hsl = color.rgbToHsl(r, g, b);
		const h = Math.ceil(hsl[0] * 12);
		const l = Math.ceil(hsl[2] * 59);
		const j = (l + 60 - 1) % 60;
		h_count[j].count++;
		h_count[j].hsl[0] += hsl[0];
		h_count[j].hsl[1] += hsl[1];
		h_count[j].hsl[2] += hsl[2];
		hsl_data[i * 3 + 0] = hsl[0];
		hsl_data[i * 3 + 1] = hsl[1];
		hsl_data[i * 3 + 2] = hsl[2];
	}
	for (const h of h_count) {
		for (let i = 0; i < 3; ++i) {
			h.hsl[i] /= h.count;
		}
	}
	console.log(h_count);
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
		return {}
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
				initalData.data[(y * canvas.width + x) * 4 + 2],
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

				/*
			if ((tag === 1 && lastTag > 0) || (tag !== 1 && tag !== lastTag)) {
				const start_time = new Date();

				ctx.putImageData(initalData, 0, 0);
				const width = canvas.width;
				const height = canvas.height;
				const imgData = ctx.getImageData(0, 0, width, height);
				const dark = 255;
				const light = tag === 1 ? 255 : 50;
				for (let i = 0; i < height; ++i) {
					for (let j = 0; j < width; ++j) if (group[i * width + j] === tag) {
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
				console.log(`time used: ${(new Date()).getTime() - start_time.getTime()} ms`);
			}
			*/
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
			pretreatment(canvas);	
			canvas2.width = img.width;
			canvas2.height = img.height;
		};
	}
};