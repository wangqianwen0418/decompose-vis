import introJs from 'intro.js';
import * as color from "../../utils/color.js";
import { offset } from "../../utils/common-utils.js";
import { decompose } from "../../algorithm/decompose.js";
import { compose, findGroup } from "../../algorithm/compose.js";
import color_space_divide from "../../algorithm/color-space-divide.js";
import { systematic_sampling_seq } from "../../algorithm/sampling.js";
import { interactionInit } from "../../interaction/interaction.js"
import { Canvas, Item } from "../../canvas/canvas-object.js";
import * as d3 from "d3";
import { mapState } from 'vuex';

let ngroup, groups, maxtimestamp, currenttime, lastgroup, tags;
let initalData, currentData, color_spaces = [], img;
let zoom_ratio, bgtag;

export default {
   data() {
		const blocks = ['overview', '1', '2', '3'].map(d => ({
				name: d,
				canvas: null,
			}))

		return {
            blocks: blocks,
			activeBlock: blocks[0],
		};
    },
	props: ['src', 'width', 'height'],
    computed:{
        ...mapState({
            temps:'temps',
            blocksTrue: 'blocks',
        })
    },
	methods: {
        deleteTab() {
            const index=this.blocks.indexOf(this.activeBlock);
            this.blocks.splice(index,1);
            this.blocksTrue.splice(index, 1);
        },
        addTab(){
            const item = {};
            // item.name = this.blocks.length.toString();
            item.name="new";
			const canvas = this.$el.getElementsByTagName('canvas')[0];
            item.canvas = new Canvas(canvas);
            this.blocks.push(item);
        },
        addBlock(temp) {
			const block = JSON.parse(JSON.stringify(temp));
			block.canvas = this.activeBlock.canvas;
            this.blocksTrue.push(block);
            this.activeBlock.name=block.name;
            // this.blocks.forEach((blk)=>{
            //     if(blk.name==this.activeBlock.name)
            //      blk.name = temp.name;
            // })
        },
		figureTabClass(item) {
			return {
				"figure-tabs-item": true,
				"active": item == this.activeBlock
			};
		},

		editorRender(event) {
			return;
			if (this.editor !== null)
				this.editor.canvas.render();
		},
		canvasRender(event) {
			this.activeBlock.canvas.render();
		},
		onRightClick(event) {
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			const x = Math.floor((event.pageX - offset.x(canvas)) * zoom_ratio);
			const y = Math.floor((event.pageY - offset.y(canvas)) * zoom_ratio);
			let group0 = ngroup[y * canvas.width + x];
			if (group0 != null) {
				group0 = findGroup(group0, currenttime);
				this.activeBlock.canvas.removeItem(this.activeBlock.canvas.getItem(x, y));
				this.canvasRender(event);
			}
		},
		onClick(event) {
			const start_time = new Date();
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			const x = Math.floor((event.pageX - offset.x(canvas)) * zoom_ratio);
			const y = Math.floor((event.pageY - offset.y(canvas)) * zoom_ratio);
			if (tags[y * canvas.width + x] === bgtag) {
				return;
			}
			console.log(event, event.shiftKey, event.ctrlKey, event.altKey);

			if (event.shiftKey && !event.ctrlKey && !event.altKey) {

				// add a single item
				let group0 = ngroup[y * canvas.width + x];
				if (group0 != null) {
					group0 = findGroup(group0, currenttime);
					this.activeBlock.canvas.addItem(new Item(group0));
					this.canvasRender(event);
				}
			}
			else if (!event.shiftKey && !event.ctrlKey && !event.altKey) {
				let group0 = ngroup[y * canvas.width + x];
				if (group0 != null) {
					group0 = findGroup(group0, currenttime);

					// add all the items
					const gs = new Array();
					gs.push(group0);
					for (const group of groups) {
						if (group.points.length > 10 &&

							//group.tag === group0.tag && 
							group !== group0 &&

							Math.abs(group.color[0] - group0.color[0]) < 0.02 &&
							Math.abs(group.color[1] - group0.color[1]) < 0.5 &&
							Math.abs(group.color[2] - group0.color[2]) < 0.5
							) {
							gs.push(group);
						}
					}
					this.activeBlock.canvas.addItem(new Item(gs));
					this.canvasRender(event);
				}
			}
			this.editorRender(event);
		},
		onMousemove(event) {
			const start_time = new Date();
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			const x = Math.floor((event.pageX - offset.x(canvas)) * zoom_ratio);
			const y = Math.floor((event.pageY - offset.y(canvas)) * zoom_ratio);
			if (tags[y * canvas.width + x] === bgtag) {
				return;
			}

			let group0 = ngroup[y * canvas.width + x];
			if (group0 != null) {
				group0 = findGroup(group0, currenttime);
				const item = new Item(group0);
				this.activeBlock.canvas.addItem(item);
				this.canvasRender(event);
				this.activeBlock.canvas.removeItem(item);
			}

			console.info(x, y, event, `time used: ${(new Date()).getTime() - start_time.getTime()} ms`);
		},
		onTabClick(item) {
			console.log(item);
			this.activeBlock = item;
			// this.editor = item;
			this.canvasRender();
		},
	},

	mounted() {
		const canvas = this.$el.getElementsByTagName('canvas')[0];
		const svg = this.$el.getElementsByTagName('svg')[0];
		const ctx = canvas.getContext('2d');
		img = new Image();
		img.src = this.src;
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			const realWidth = canvas.parentNode.clientWidth;
			const realHeight = canvas.parentNode.clientHeight;
			zoom_ratio = Math.max(img.width / realWidth, img.height / realHeight);
			for (const block of this.blocks) {
				block.canvas = new Canvas(canvas);
				block.canvas.backgroundImg = img;
				block.canvas.bgAlpha = 0.05;
			}
			this.blocks[0].canvas.bgAlpha = 1;
			this.blocks[0].canvas.render();
			preprocessing(canvas);
		};
		interactionInit();
	}
};

function preprocessing(canvas) {
	const start_time = new Date();

	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;

	const imgData = ctx.getImageData(0, 0, width, height);
	const data = imgData.data;
	initalData = imgData;
	const hsl_data = new Float32Array(width * height * 3);
	console.info(`time used: ${(new Date()).getTime() - start_time.getTime()} ms`);

	const seq = systematic_sampling_seq(height * width);
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
	console.info(division.tagcount);
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
	console.info(count);
	for (let i = 0; i < count.length; ++i) if (count[i] / (width * height) * 100 > 0.1) {
		color_spaces.push({
			text: `${(count[i] / (width * height) * 100).toFixed(2)}%\n
				${i === 0 ? 'background' : division.tag2hsl(i)}`,
			style:{ color: division.tag2rgb(i)},
			count: count[i],
			index: i,
			name: i.toString(),
		});
	}
	color_spaces.sort((a, b) => b.count - a.count);
	bgtag = color_spaces[0].index;
	for (let i = 0; i < height * width; ++i) {
		if (tags[i] === bgtag) {
			hsl_data[i * 3] = -1;
		}
	}

	console.info(`rgbtoHsl: ${(new Date()).getTime() - start_time.getTime()} ms`);
	const decomposed = decompose(hsl_data, width, height);
	console.info(`decompose: ${(new Date()).getTime() - start_time.getTime()} ms`);
	const elements = compose(decomposed.elements, width, height);
	// console.info(`compose: ${(new Date()).getTime() - start_time.getTime()} ms`);
	ngroup = new Array(width * height);
	groups = elements;
	for (const element of elements) {
		const points = element.points;
		for (let i = 0; i < points.length; i += 2) {
			ngroup[points[i] + points[i + 1] * width] = element;
		}
		if (element.timestamp > maxtimestamp) {
			maxtimestamp = element.timestamp;
		}
		element.tag = color2tag(element.color);
	}
	console.log(elements);

	currenttime = maxtimestamp;
	ctx.putImageData(imgData, 0, 0);
	currentData = ctx.getImageData(0, 0, width, height);
	console.info(`total time used: ${(new Date()).getTime() - start_time.getTime()} ms`);
}



function calc(canvas) {
	const start_time = new Date();

	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;

	const imgData = ctx.getImageData(0, 0, width, height);
	const data = imgData.data;
	initalData = imgData;
	const hsl_data = new Float32Array(width * height * 3);
	console.info(`time used: ${(new Date()).getTime() - start_time.getTime()} ms`);

	const seq = systematic_sampling_seq(height * width);
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
	console.info(division.tagcount);
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
	console.info(count);
	for (let i = 0; i < count.length; ++i) if (count[i] / (width * height) * 100 > 0.1) {
		color_spaces.push({
			text: `${(count[i] / (width * height) * 100).toFixed(2)}%\n
				${i === 0 ? 'background' : division.tag2hsl(i)}`,
			style:{ color: division.tag2rgb(i)},
			count: count[i],
			index: i,
			name: i.toString(),
		});
	}
	color_spaces.sort((a, b) => b.count - a.count);
	bgtag = color_spaces[0].index;
	for (let i = 0; i < height * width; ++i) {
		if (tags[i] === bgtag) {
			hsl_data[i * 3] = -1;
		}
	}

	console.info(`rgbtoHsl: ${(new Date()).getTime() - start_time.getTime()} ms`);
	const decomposed = decompose(hsl_data, width, height);
	console.info(`decompose: ${(new Date()).getTime() - start_time.getTime()} ms`);
	const elements = compose(decomposed.elements, width, height);
	elements.forEach(function(d) {
		d.rgb = color.hslToRgb(d.color[0], d.color[1], d.color[2]);
		d.r = Math.floor(d.rgb[0]);
		d.g = Math.floor(d.rgb[1]);
		d.b = Math.floor(d.rgb[2]);
	});
	// console.info(`compose: ${(new Date()).getTime() - start_time.getTime()} ms`);
	ngroup = new Array(width * height);
	groups = elements;
	for (const element of elements) {
		const points = element.points;
		for (let i = 0; i < points.length; i += 2) {
			ngroup[points[i] + points[i + 1] * width] = element;
		}
		if (element.timestamp > maxtimestamp) {
			maxtimestamp = element.timestamp;
		}
		element.tag = color2tag(element.color);
	}
	console.log(elements);

	currenttime = maxtimestamp;
	ctx.putImageData(imgData, 0, 0);
	currentData = ctx.getImageData(0, 0, width, height);
	console.info(`total time used: ${(new Date()).getTime() - start_time.getTime()} ms`);
}


function ondragstart() {
	const event = d3.event;
	event.dataTransfer.clearData();
	event.dataTransfer.setData('text', event.target.id);
}

function ondragend() {
    event.preventDefault();
}
