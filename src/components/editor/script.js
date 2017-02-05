import { mapState, mapActions } from 'vuex';
import { EDIT_ITEM } from '../../store';


export default {
    data() {
        return { message: '' };
    },
    computed: {
        ...mapState({
            mesWatcher: (state) => {
                const selectedItem = state.items.filter(item => item.selected)[0];
                if (selectedItem) return selectedItem.content;
                return null;
            },
        }),
    },
    methods: {
        ...mapActions({
            editItem: EDIT_ITEM,
        }),
    },
    watch: {
        mesWatcher(val) {
            this.message = val;
        },
    },
};
