import draggable from 'vuedraggable';
import { mapActions, mapGetters, mapState } from 'vuex';
import { REMOVE_CHANNEL } from '../../store';

export default {
    computed: {
        ...mapState({
            marks: 'marks',
            channels: 'channels',
        }),
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
