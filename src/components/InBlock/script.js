import draggable from 'vuedraggable';
import markv from '../mark';
import { UPDATE_CHANNEL } from '../../store';
import { mapGetters, mapState, mapActions } from 'vuex';
// import { ADD_MARK } from '../../store';

export default {
    computed: {
        ...mapGetters({
            selectedBlock: 'selectedBlock',
        }),
        ...mapState({
            marksTemp: 'marksTemp',
            blocks: 'blocks',
        }),
        block() {
            return this.selectedBlock || this.blocks[0];
        },
    },
    components: {
        draggable,
        markv,
    },
    methods: {
        ...mapActions({
            updateChannel: UPDATE_CHANNEL,
        }),
        addMark(markTemp) {
            const clone = JSON.parse(JSON.stringify(markTemp));
            clone.parent = this.block;
            clone.channels.forEach((channel) => {
                channel.parent = clone;
            });
            this.block.marks.push(clone);
            this.updateChannel(clone.channels);
        },
    },
};
