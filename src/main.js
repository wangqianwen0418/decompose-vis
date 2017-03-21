import Vue from 'vue';
import ElementUI from 'element-ui';
import VueResource from 'vue-resource';
import locale from 'element-ui/lib/locale/lang/en';
import '../theme/index.css';
// import './styles/index.css';
import '../font-awesome-4.7.0/css/font-awesome.min.css';
import '../node_modules/intro.js/introjs.css';
import store from './store';
import App from './components/Survey';


Vue.use(ElementUI, { locale });
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    render: h => h(App),
});
