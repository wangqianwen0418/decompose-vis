import { mapState, mapActions, mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import slide from '../Slide';
import { ADD_ITEM } from '../../store';

export default {
    data() {
        return {
            // dragging: false,
        };
    },
    components: {
        slide,
        draggable,
    },
    computed: {
        ...mapState({
            // blocks: 'blocks',
            calculatedWidth: (state) => {
                let len = 0;
                state.blocks.forEach((blk) => {
                    blk.marks.forEach((mark) => {
                        mark.channels.forEach((channel) => {
                            if (!channel.removed) len += 1;
                        });
                    });
                });
                return (len + 1) * screen.width * 0.4;
            },
        }),
        ...mapGetters({
            blocks: 'sortedBlocks',
        }),
    },
    methods: {
        ...mapActions({
            addItem: ADD_ITEM,
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
