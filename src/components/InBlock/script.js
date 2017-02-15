import draggable from 'vuedraggable';
import { mapActions, mapGetters } from 'vuex';
import { REMOVE_CHANNEL } from '../../store';

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
            removeChannel: REMOVE_CHANNEL,
        }),
    },
};
