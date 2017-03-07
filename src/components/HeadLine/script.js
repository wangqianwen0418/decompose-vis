import { EDIT_EXP } from '../../store';

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
    computed: {
      textDescription: {
        set(value) {
          value = value.split('.');
          let types = ['size','color-h','color-s'];
          types.forEach((item) => {
            this.makeIt(item,value);
          })
        },
      },
    },
    methods: {
      makeIt(section,value) {
        let dict = {};
        let sentences = [];
        dict['color-s'] = ['color','saturation'];
        dict['position'] = ['position','location','x-coordinate','points'];
        dict['color-h'] = ['color','hue','shades'];
        dict['size'] = ['size','width'];
        dict['shape'] = ['shape','figure','glyph','triangle','square'];
        value.forEach(function(item) {
          dict[section].forEach(function(word){
            if(item.includes(word)) {
                sentences.push(item);
            }
          });
        });
        console.log(sentences);
        this.$store.state.blocks.forEach(function(block) {
          block.marks.forEach(function(mark) {
            mark.channels.forEach(function(channel) {
              if(channel.name == section) {
                channel.explanation = sentences.join(".");
              }
            })
          })
        })
    },
    },
};
