import draggable from 'vuedraggable';
import { mapState, mapActions } from 'vuex';
// import { ADD_CHANNEL, REMOVE_MARK } from '../../store';
import channel from '../channel';
import { UPDATE_CHANNEL } from '../../store';

export default {
    props: ['mark', 'block', 'channels'],
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
        ...mapActions({
            updateChannel: UPDATE_CHANNEL,
        }),
        addChannel(channelTemp) {
            // console.info(channelTemp);
            const clone = JSON.parse(JSON.stringify(channelTemp));
            clone.parent = this.mark;
            this.mark.channels.push(clone);
        },
        removeMark() {
            const index = this.block.marks.indexOf(this.mark);
            if (index > -1) {
                this.block.marks.splice(index, 1);
            }
        },
    },
    watch: {
        channels() {
            this.updateChannel(this.channels);
        },
    },
};
