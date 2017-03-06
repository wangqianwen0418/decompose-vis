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
        };
    },
    methods: {
        save() {
            this.$notify.success({
                message: 'Your NarVis is Saved !',
                offset: 100,
            });
        },
    },
};
