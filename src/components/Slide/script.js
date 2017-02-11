import * as d3 from 'd3';
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
                    border: '1vh solid #1499CC',
                    height: '18vh',
                    width: '18vw',
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
