import draggable from 'vuedraggable';
import OneSlide from '../OneSlide';

export default {
    computed: {
        calculatedWidth() {
            // `this` points to the vm instance
            return (this.$store.getters.items.length + 1) * screen.width * 0.4;
        },
        items() {
            return this.$store.getters.items;
        },
    },
    methods: {
        addItem() {
            this.$store.dispatch('addItem');
        },
    },
    components: {
        OneSlide,
        draggable,
    },
};
