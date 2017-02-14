import * as d3 from 'd3';
import VisFigure from '../VisFigure';

export default {
    components: { VisFigure },
    data() {
        return {
            activeName: '1',
        };
    },
    methods: {
        drag(event) {
            console.info(event.target);
            event.dataTransfer.setData('dragTarget', event.target.id);
            // event.dataTransfer.setData("dragTarget", event.target.src);
        },
    },
};
