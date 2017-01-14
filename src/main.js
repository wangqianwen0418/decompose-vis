import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import App from './App.vue'



Vue.use(VueMaterial)
Vue.use(ElementUI)
Vue.use(VueAwesomeSwiper)

new Vue({
  el: '#app',
  render: h => h(App)
});
