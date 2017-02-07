import { mapActions } from 'vuex';
import { EDIT_ITEM } from '../../store';


export default {
    // data() {
    //     return { message: '' };
    // },
    computed: {
        message: {
            get() {
                const selectedItem = this.$store.state.items.filter(item => item.selected)[0];
                // const i = this.$store.state.items.indexOf(selectedItem);
                if (selectedItem) {
                    return selectedItem.content;
                }
                return '';
            },
            set(value) {
                this.$store.commit('EDIT_ITEM', value);
            },
        },
    },
    methods: {
        ...mapActions({
            editItem: EDIT_ITEM,
        }),
    },
    // watch: {
    //     mesWatcher(val) {
    //         this.message = val;
    //     },
    // },
};
