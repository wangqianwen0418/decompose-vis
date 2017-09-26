import introJs from 'intro.js';

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
        };
    },
    computed: {
      textDescription: {
        set(value) {
          let values = value.split('.');
          let types = ['size','color-h','color-s','position','shape'];
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
        dict['position'] = ['position','location','x-coordinate','points','distances'];
        dict['color-h'] = ['color','hue','shades','scheme'];
        dict['size'] = ['size','width','importance score','bigger','smaller'];
        dict['shape'] = ['shape','figure','glyph','triangle','square','icon'];
        value.forEach(function(item,index,array) {
          dict[section].forEach(function(word){
            if(item.includes(word)) {
                array[index] = "<b>" + item + "</b>";
            }
          });
        });
        //value[0] = "<textarea>" + value[0];
        //value[value.length - 1] = value[value.length - 1] + "</textarea>";
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
    onImport() {
      setTimeout(function() {
        const canvas = document.getElementsByTagName('canvas')[0];
        this.showForm = false;
        canvas.style.display = 'block';
      }, 2000);
    },
  },
};
