import { mapActions } from 'vuex';
import draggable from 'vuedraggable';
import { REMOVE_ITEM, SELECT_ITEM } from '../../store';

// {'b':2, 'a':1}
export default {
    props: ['item', 'index'],
    methods: {
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
