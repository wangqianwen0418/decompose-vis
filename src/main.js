import ElementUI from 'element-ui';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.css';
import store from './store';
import App from './components/App';
import '../theme/index.css';

Vue.use(VueMaterial);
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    render: h => h(App),
});

