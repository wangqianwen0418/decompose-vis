import * as d3 from 'd3';

export default {
    data() {
        return {
            activeName: 'first',
        };
    },
    methods: {
        drag(event) {
            console.info(event.target);
            event.dataTransfer.setData('dragTarget', event.target.id);
            // event.dataTransfer.setData("dragTarget", event.target.src);
        },
    }
};
