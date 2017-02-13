import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            block: 'selectedBlock',
        }),
    },
    components: {
        draggable },
};
