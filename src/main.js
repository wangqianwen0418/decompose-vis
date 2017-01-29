import '../theme/index.css'
import ElementUI from 'element-ui'
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import store from './store'
import App from './components/App'

Vue.use(VueMaterial)
Vue.use(ElementUI)


new Vue({
  el: '#app',
  store,
  render: h => h(App)
});

