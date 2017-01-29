import draggable from 'vuedraggable';

export default {
    props: ['item', 'index'],
    methods: {
        removeItem(item) {
            this.$store.dispatch('removeItem', item);
        },
        selectItem(item) {
            this.$store.dispatch('selectItem', item);
        },
        drag(event) {
            console.info(event.target);
            event.dataTransfer.setData('dragTarget', event.target.id);
        },
        allowDrop(ev) {
            ev.preventDefault();
        },
        drop(ev) {
            console.info(ev.target);
            ev.preventDefault();
            const data = ev.dataTransfer.getData('dragTarget');
            const itm = document.getElementById(data);
            const cln = itm.cloneNode(true);
            ev.target.appendChild(cln);
            // this.item.attachedEle.push(data);
        },
    },
    computed: {
        styleObject() {
            if (this.item.selected) {
                return {
                    border: '5px solid #1499CC',
                };
            }
            return null;
        },
    },
    components: {
        draggable,
    },
};
