import draggable from 'vuedraggable';
import { mapGetters, mapActions } from 'vuex';
import { REMOVE_ITEM } from '../../store';

export default {
    computed: {
        ...mapGetters({
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
