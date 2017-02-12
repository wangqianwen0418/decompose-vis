import { mapState, mapActions } from 'vuex';
// import draggable from 'vuedraggable';
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
        // draggable,
    },
    computed: {
        ...mapState({
            blocks: 'blocks',
            calculatedWidth: (state) => {
                let len = 0;
                const blocks = state.blocks;
                for (const i in blocks) {
                    for (const j in blocks[i].marks) {
                        len += blocks[i].marks[j].channels.length;
                    }
                }
                return (len + 1) * screen.width * 0.4;
            },
        }),
    },
    methods: {
        ...mapActions({
            addItem: ADD_ITEM,
        }),
    },
};
