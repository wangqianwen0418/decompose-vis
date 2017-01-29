import { mapActions } from 'vuex';
import draggable from 'vuedraggable';
import { REMOVE_ITEM, SELECT_ITEM } from '../../store';

export default {
    props: ['item', 'index'],
    methods: {
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
        ...mapActions({
            removeItem: REMOVE_ITEM,
            selectItem: SELECT_ITEM,
        }),
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
