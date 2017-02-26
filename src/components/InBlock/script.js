import draggable from 'vuedraggable';
import channel from '../channel';
import { mapGetters, mapActions } from 'vuex';
import { REMOVE_CHANNEL, SELECT_CHANNEL } from '../../store';

export default {
    computed: {
        styleObject() {
            if (this.channel.selected) {
                return {
                    color: 'red',
                };
            }
            return null;
        },
        ...mapGetters({
            block: 'selectedBlock',
        }),
    },
    components: {
        draggable,
        channel,
    },
    methods: {
        ...mapActions({
            removeChannel: REMOVE_CHANNEL,
            selectChannel: SELECT_CHANNEL,
        }),
    },
};
