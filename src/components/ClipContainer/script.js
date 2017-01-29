import clip from '../Clip';

export default {
    data() {
        return {
            newItem: '',
            items: [
                { content: 'Get Milk', done: true },
                { content: 'Get Water', done: true },
                { content: 'Get Bread', done: true },
                { content: 'Get Milk', done: true },
                { content: 'Get Water', done: true },
                { content: 'Get Bread', done: true },
            ],
        };
    },
    methods: {
        removeItem(index) {
            this.items.splice(index, 1);
        },
        addItem() {
            this.items.push({
                content: 'add new',
                done: false,
            });
            this.newItem = '';
        },
    },
    components: {
        clip,
    },
};
