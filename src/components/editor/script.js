export default {
    computed: {
        selectedItem() {
            return this.$store.getters.selectedItem
        },
        message() {
            return this.$store.getters.selectedItem.content
        }
    },
    methods: {
        editItem(event) {
            this.$store.dispatch('editItem', event.target.value)
        }
    }
}