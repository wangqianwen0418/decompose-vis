import { mapState, mapActions } from 'vuex';
import draggable from 'vuedraggable';
import slide from '../Slide';
import { ADD_ITEM, UPDATE_ITEM } from '../../store';

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
            items: 'items',
            calculatedWidth: state => (state.items.length + 1) * screen.width * 0.4,
        }),
    },
    methods: {
        move(evt) {
            console.info(evt);
        },
        endDrag(evt) {
            this.updateItem(this.items);
        },
        startDrag(evt) {
            console.info(evt);
        },
        ...mapActions({
            addItem: ADD_ITEM,
            updateItem: UPDATE_ITEM,
        }),
    },
};
