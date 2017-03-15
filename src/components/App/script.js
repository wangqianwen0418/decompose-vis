import HeadLine from '../HeadLine';
import resource from '../Resource';
import TextSource from '../TextSource';
import editor from '../Editor';
import slides from '../SlideContainer';
import introJs from 'intro.js';

export default {
    components: {
        HeadLine,
        resource,
        editor,
        slides,
        TextSource,
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
