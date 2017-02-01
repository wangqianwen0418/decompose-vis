import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            selectedItem: 'selectedItem',
            message: state => state.selectedItem.content,
        }),
    },
    methods: {
        editItem(event) {
            this.$store.dispatch('editItem', event.target.value);
        },
    },
};
