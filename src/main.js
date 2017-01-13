import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import App from './App.vue'
Vue.use(ElementUI)
Vue.use(VueAwesomeSwiper)

new Vue({
  el: '#app',
  render: h => h(App)
});
