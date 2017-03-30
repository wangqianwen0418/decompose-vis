import introJs from 'intro.js';
import * as color from "../../utils/color.js";
import { offset } from "../../utils/common-utils.js";
import { decompose } from "../../algorithm/decompose.js";
import { compose, findGroup } from "../../algorithm/compose.js";
import color_space_divide from "../../algorithm/color-space-divide.js";
import { systematic_sampling_seq } from "../../algorithm/sampling.js";
import { interactionInit } from "../../interaction/interaction.js"
import { Canvas, AnimatedCanvas, Item } from "../../canvas/object.js";
import { UPDATE_CHANNEL } from '../../store';
import * as d3 from "d3";
import { mapState, mapActions } from 'vuex';
let ngroup, groups, maxtimestamp, currenttime, lastgroup, tags;
let initalData, currentData, color_spaces = [], img;
let zoom_ratio, bgtag;

function getItemsByColor(color) {
	const items = new Array();
	for (const group of groups) {
		if (group.points.length > 10 &&
			Math.abs(group.color[0] - color[0]) < 0.02 &&
			Math.abs(group.color[1] - color[1]) < 0.5 &&
			Math.abs(group.color[2] - color[2]) < 0.5
		) {
			items.push(group);
		}
	}
	return items;
}

export default {
	data() {
		const tabs = ['overview', '1', '2', '3'].map(d => ({
			name: d,
			canvas: null,
		}));

		const riverColors = [[0.0020083391403067237, 0.7991378594747043, 0.7972484069155104], 
		[0.17091630819043235, 0.24427248600612952, 0.6785767693715141]];
		const lineColors = [[0.6126223569330962, 0.4529497680456742, 0.37725490927696226],
		[0.4829212535793583, 0.6061479896306992, 0.5492647190888723]];
		const glyphColors = [[0.9952069182021945, 0.9415364426465336, 0.6204195031673041]];

		tabs[1].colors = riverColors;
		tabs[2].colors = lineColors;
		tabs[3].colors = glyphColors;

		tabs[1].dividingLines = [[25, 752, 265, 451], [672, 451, 921, 377]];//[1216, 764, 1289, 723]];

		return {
			tabs: tabs,
			activeTab: tabs[0],
			tempShow: false,
		};
	},
	props: ['src', 'width', 'height'],
	computed: {
		...mapState({
			temps: 'temps',
			blocks: 'blocks',
		}),
	},
	methods: {
        ...mapActions({
            updateChannel: UPDATE_CHANNEL,
        }),
		deleteTab() {
			const index = this.tabs.indexOf(this.activeTab);
			this.tabs.splice(index, 1);
			this.blocks.splice(index, 1);
		},
		addTab() {
			const item = new Object();
			// item.name = this.blocks.length.toString();
			item.name = "" + this.tabs.length;
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			item.canvas = new Canvas(canvas);
			item.canvas.backgroundImg = img;
			item.canvas.bgAlpha = 0.05;
			this.tabs.push(item);
			this.activeTab = this.tabs[this.tabs.length - 1];
			this.canvasRender();
		},
		addBlock(temp) {
			this.tempShow = false;
			if (this.activeTab.name === 'overview') {
				return;
			}
			const block = JSON.parse(JSON.stringify(temp));
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const editorCanvas = document.getElementsByClassName('editorCanvas')[0];
			block.canvas = new AnimatedCanvas(editorCanvas, canvas.width, canvas.height);
			for (const item of this.activeTab.canvas.items) {
				block.canvas.addItem(new Item(item));
			}
			const hasName = (name) => {
				for (const b of this.blocks) {
					if (b.name === name) {
						return true;
					}
				}
				return false;
			};

			for (let i = 1; ; ++i) {
				const name = block.name + (i === 1 ? '' : i);
				if (!hasName(name)) {
					block.name = name;
					break;
				}
			}
			block.marks.forEach((mark) => {
				mark.parent = block;
				mark.canvas = block.canvas;
				mark.channels.forEach((channel) => {
					channel.parent = mark;
				});
				this.updateChannel(mark.channels);
			});
			this.blocks.push(block);
			this.activeTab.name = block.name;
		},
		figureTabClass(item) {
			return {
				"figure-tabs-item": true,
				"active": item == this.activeTab
			};
		},
		canvasRender(event) {
			this.activeTab.canvas.render();
		},
		onRightClick(event) {
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			const x = Math.floor((event.pageX - offset.x(canvas)) * zoom_ratio);
			const y = Math.floor((event.pageY - offset.y(canvas)) * zoom_ratio);
			this.activeTab.canvas.removeItem(this.activeTab.canvas.getItem(x, y));
			this.canvasRender(event);
		},
		onClick(event) {
			const start_time = new Date();
			const canvas = this.$el.getElementsByTagName('canvas')[0];
			const ctx = canvas.getContext('2d');
			const x = Math.floor((event.pageX - offset.x(canvas)) * zoom_ratio);
			const y = Math.floor((event.pageY - offset.y(canvas)) * zoom_ratio);
			console.log('click point', x, y);
			if (tags[y * canvas.width + x] === bgtag) {
				return;
			}
			//console.log(event, event.shiftKey, event.ctrlKey, event.altKey);
			if (event.shiftKey && !event.ctrlKey && !event.altKey) {
				// add a single item
				let group0 = ngroup[y * canvas.width + x];
				if (group0 != null) {
					group0 = findGroup(group0, currenttime);
					this.activeTab.canvas.addItem(new Item(group0));
					this.canvasRender(event);
				}
			}
			else if (!event.shiftKey && !event.ctrlKey && !event.altKey) {
				let group0 = ngroup[y * canvas.width + x];
				console.info(y * canvas.width + x);
				if (group0 != null) {
					group0 = findGroup(group0, currenttime);
					const items = getItemsByColor(group0.color);
					this.activeTab.canvas.addItem(new Item(items));
					this.canvasRender(event);
				}
			}
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
				const canvas = this.activeTab.canvas;
				const currentItem = canvas.getItem(x, y);
				if (currentItem) {
					canvas.render(this.activeTab.canvas.getItem(x, y));
				} else {
					const tempItem = new Item(group0);
					canvas.addItem(tempItem);
					canvas.removeItem(tempItem);
				}
			}
//			console.info(x, y, event, `time used: ${(new Date()).getTime() - start_time.getTime()} ms`);
		},
		onMouseout(event) {
			this.canvasRender(event);
		},
		onTabClick(item) {
			this.activeTab = item;
			this.canvasRender();
			console.info('Current canvas has ' + this.activeTab.canvas.items.length + ' items');
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
			for (const block of this.tabs) {
				block.canvas = new Canvas(canvas);
				block.canvas.backgroundImg = img;
				block.canvas.bgAlpha = 0.05;
			}
			this.tabs[0].canvas.bgAlpha = 1;
			this.tabs[0].canvas.render();
			preprocessing(canvas);
			for (const block of this.tabs) {
				if (!!block.colors) {
					for (const color of block.colors) {
						const items = getItemsByColor(color);
						block.canvas.addItem(new Item(items));
					}
				}
				if (!!block.dividingLines) {
					const items = block.canvas.items;
					for (let i = 0; i < items.length; ++i) {
						for (const line of block.dividingLines) {
							if (items[i].cross(line[0], line[1], line[2], line[3])) {
								block.canvas.addItem(items[i].split(line[0], line[1], line[2], line[3]));
								--i;
								break;
							}
						}
					}
					for (let i = 0; i < items.length; ++i) {
						items[i].index = i;
					}
				}
			}
			// this.tabs[1].canvas.addItem(this.tabs[1].canvas.items[0].split());
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
			style: { color: division.tag2rgb(i) },
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
	// console.log(groups);
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
