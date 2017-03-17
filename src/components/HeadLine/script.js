import introJs from 'intro.js';
import preview from '../Preview';

let logdata = null;
export default {
    data() {
        return {
            options: [{
                value: '1',
                label: 'case study 1',
            }, {
                value: '2',
                label: 'case study 2',
            }],
            showForm: false,
            showView: false,
            value: '',
            textDescription: '',
            starttime: null,
        };
    },
    methods: {
        save() {
            this.$notify.success({
                message: 'Your NarVis is Saved !',
                offset: 100,
            });
            this.$http.post('http://localhost:9999/save', { name: 'wqw' }).then((res) => {
                console.info(res);
            }, (err) => {
                console.info(err);
            });
        },
        intro() {
            introJs.introJs().start();
        },
        onPreview() {
            this.showView = !this.showView;
        },
        updatelog(data) {
            logdata = data;
        },
        uploadlog() {
            const name = `user${Math.floor(Math.random() * 100000)}`;
            this.$http.post('http://patpat.net:9999/save', {
                name,
                data: logdata,
            }).then((res) => {
                console.info(res);
            }, (err) => {
                console.info(err);
            });
            console.info(logdata);
        },
    },
    components: {
        preview,
    },
};
