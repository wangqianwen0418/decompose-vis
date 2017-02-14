import draggable from 'vuedraggable';
import { mapActions, mapState } from 'vuex';
import { REMOVE_ITEM } from '../../store';

export default {
    computed: {
        ...mapState({
            block: 'selectedBlock',
        }),
    },
    components: {
        draggable,
    },
    methods: {
        ...mapActions({
            removeItem: REMOVE_ITEM,
        }),
    },
};
