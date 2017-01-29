import { mapActions } from 'vuex';
import draggable from 'vuedraggable';
import { REMOVE_ITEM, SELECT_ITEM } from '../../store';

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
