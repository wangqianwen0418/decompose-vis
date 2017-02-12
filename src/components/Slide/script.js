import { mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';
import { REMOVE_ITEM, SELECT_ITEM } from '../../store';

console.info(document.getElementById('slideText'));
// {'b':2, 'a':1}
export default {
    props: ['item', 'mark', 'block'],
    data() {
        return {
            height: window.innerHeight * 0.4,
            width: window.innerWidth * 0.35,
            line: '',
        };
    },
    methods: {
        ...mapActions({
            removeItem: REMOVE_ITEM,
            selectItem: SELECT_ITEM,
        }),
    },
    computed: {
        styleObject() {
            if (this.item.selected) {
                return {
                    border: '0.5vh dashed #417378',
                    height: '19vh',
                    width: '19vw',
                };
            }
            return null;
        },
        ...mapState({
            selectedEle: 'selectedEle',
        }),
    },
    // mounted() {
    //     this.calculatePath();
    // },
    components: {
        draggable,
    },
};
