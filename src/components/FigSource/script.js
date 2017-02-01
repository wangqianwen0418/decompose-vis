export default {
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
