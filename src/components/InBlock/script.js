import draggable from 'vuedraggable';
import markv from '../mark';
import { mapGetters, mapState } from 'vuex';
// import { ADD_MARK } from '../../store';

export default {
    computed: {
        ...mapGetters({
            block: 'selectedBlock',
        }),
        ...mapState({
            marksTemp: 'marksTemp',
        }),
    },
    components: {
        draggable,
        markv,
    },
    methods: {
        addMark(markTemp) {
            this.block.marks.push(markTemp);
        },
    },
};
