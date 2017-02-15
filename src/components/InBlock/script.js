import draggable from 'vuedraggable';
import { mapActions, mapState } from 'vuex';
import { REMOVE_CHANNEL } from '../../store';

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
            removeChannel: REMOVE_CHANNEL,
        }),
    },
};
