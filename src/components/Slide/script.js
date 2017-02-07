import { mapActions } from 'vuex';
import draggable from 'vuedraggable';
import { REMOVE_ITEM, SELECT_ITEM } from '../../store';
import * as d3 from 'd3';

// {'b':2, 'a':1}
export default {
    props: ['item', 'index'],
    methods: {
		ondrop(event) {
			const id = event.dataTransfer.getData('text');
			const item = document.getElementById(id);
			const geo = item.getElementsByTagName('svg')[0].firstChild;
			const x = item.getAttribute('x');
			const y = item.getAttribute('y');
			const width = item.getAttribute('width');
			const svg = this.$el.getElementsByClassName('svg-stage')[0];
            console.log(svg);
            const svgWidth = d3.select(svg).attr('width');
			const ratio = svgWidth / width;
            console.log(ratio, svgWidth, width);
			d3.select(geo)
				.attr('transform', `translate(${x}, ${y}), scale(${ratio})`);
			svg.appendChild(geo);
			item.remove();
		},
        ...mapActions({
            removeItem: REMOVE_ITEM,
            selectItem: SELECT_ITEM,
        }),
    },
    computed: {
        styleObject() {
            if (this.item.selected) {
                return {
                    border: '5px solid #1499CC',
                };
            }
            return null;
        },
    },
    components: {
        draggable,
    },
};
