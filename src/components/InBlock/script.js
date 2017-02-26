import draggable from 'vuedraggable';
import channel from '../channel';
import { mapGetters, mapActions, mapState } from 'vuex';
import { REMOVE_CHANNEL, SELECT_CHANNEL, ADD_CHANNEL, ADD_MARK } from '../../store';

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
        ...mapState({
            marksTemp: 'marksTemp',
            channelsTemp: 'channelsTemp',
        }),
    },
    components: {
        draggable,
        channel,
    },
    methods: {
        handleCommand1(command) {
            console.info(command);
            this.addChannel(command);
        },
        handleCommand2(command) {
            console.info(command);
            this.addMark(command);
        },
        ...mapActions({
            removeChannel: REMOVE_CHANNEL,
            selectChannel: SELECT_CHANNEL,
            addChannel: ADD_CHANNEL,
            addMark: ADD_MARK,
        }),
    },
};
