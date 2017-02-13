import draggable from 'vuedraggable';
import { mapState, mapActions } from 'vuex';
import { SELECT_BLOCK } from '../../store';

export default {
    computed: {
        ...mapState({
            blocks: 'blocks',
        }),
    },
    components: {
        draggable,
    },
    methods: {
        ...mapActions({
            selectBlock: SELECT_BLOCK,
        }),
    },
};
