import draggable from 'vuedraggable';
import { mapState } from 'vuex';
// import { ADD_CHANNEL, REMOVE_MARK } from '../../store';
import channel from '../channel';

export default {
    props: ['mark', 'block'],
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
            // console.info(channelTemp);
            const clone = JSON.parse(JSON.stringify(channelTemp));
            this.mark.channels.push(clone);
        },
        removeMark() {
            const index = this.block.marks.indexOf(this.mark);
            if (index > -1) {
                this.block.marks.splice(index, 1);
            }
        },
    },
};
