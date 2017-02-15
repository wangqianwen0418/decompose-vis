import { mapState, mapGetters } from 'vuex';
import Draggable from 'vuedraggable';
import Slide from '../Slide';

export default {
    data() {
        return {
            // dragging: false,
        };
    },
    components: {
        Slide,
        Draggable,
    },
    computed: {
        ...mapState({
            // blocks: 'blocks',
            calculatedWidth: (state) => {
                let len = 0;
                Object.keys(state.channels).forEach((channelKey) => {
                    if (!state.channels[channelKey].removed) len += 1;
                });
                return (len + 1) * screen.width * 0.4;
            },
            marks: 'marks',
            channels: 'channels',
        }),
        ...mapGetters({
            blocks: 'sortedBlocks',
        }),
    },
    watch: {
        blocks(val) {
            console.info(val);
        },
        calculatedWidth(val) {
            console.info(this.$store.getters.bTree);
        },
    },
};
