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
          let values = value.split('.');
          let types = ['size','color-h','color-s','position'];
          types.forEach((item) => {
            this.makeIt(item,values);
            values = value.split('.');
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
        value.forEach(function(item,index,array) {
          dict[section].forEach(function(word){
            if(item.includes(word)) {
                array[index] = "<b><span style='background-color: #FFFF00'>" + item + "</span></b>";
            }
          });
        });
        this.$store.state.blocks.forEach(function(block) {
          block.marks.forEach(function(mark) {
            mark.channels.forEach(function(channel) {
              if(channel.name == section) {
                channel.explanation = value.join(".");
              }
            })
          })
        })
    },
    },
};
