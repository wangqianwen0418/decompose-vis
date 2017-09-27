import HeadLine from '../HeadLine';
import resource from '../Resource';
import TextSource from '../TextSource';
import editor from '../Editor';
import introJs from 'intro.js';
import InBlock from '../InBlock';

export default {
    components: {
        HeadLine,
        resource,
        editor,
        TextSource,
        InBlock,
    },
    mounted() {
        // introJs.introJs().start();
    },
    methods: {
        intro() {
            introJs.introJs().start();
        },
    },
};
