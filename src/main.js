import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import App from './App.vue'

Vue.use(VueMaterial)
Vue.use(ElementUI)


new Vue({
  el: '#app',
  render: h => h(App)
});

