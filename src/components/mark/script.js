import draggable from 'vuedraggable';
import { mapActions, mapState } from 'vuex';
import { ADD_CHANNEL, REMOVE_MARK } from '../../store';
import channel from '../channel';

export default {
    props: ['mark'],
    computed: {
        ...mapState({
            channelsTemp: 'channelsTemp',
        }),
    },
    components: {
        draggable,
        channel,
    },
    methods: {
        // ...mapActions({
        //     addChannel: ADD_CHANNEL,
        //     removeMark: REMOVE_MARK,
        // }),
        addChannel(channelTemp) {
            this.mark.channels.push(channelTemp);
        },
        removeMark() {
            this.mark.removed = true;
        },
    },
};
