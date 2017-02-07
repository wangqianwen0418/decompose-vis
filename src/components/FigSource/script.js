import VisFigure from '../VisFigure';

export default {
	components: { "vis-figure": VisFigure },
    data() {
        return {
            activeName: 'first',
        };
    },
    methods: {
        drag(event) {
            console.log(event.target);
            event.dataTransfer.setData('dragTarget', event.target.id);
            // event.dataTransfer.setData("dragTarget", event.target.src);
        },
    },
};
