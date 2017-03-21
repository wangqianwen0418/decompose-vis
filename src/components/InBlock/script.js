import draggable from 'vuedraggable';
import markv from '../mark';
import { mapGetters, mapState } from 'vuex';
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
        addMark(markTemp) {
            const clone = JSON.parse(JSON.stringify(markTemp));
            this.block.marks.push(clone);
        },
    },
};
