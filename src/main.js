import Vue from 'vue';
import ElementUI from 'element-ui';
import VueResource from 'vue-resource';
import locale from 'element-ui/lib/locale/lang/en';
import '../theme/index.css';
// import './styles/index.css';
import store from './store';
import App from './components/App';


Vue.use(ElementUI, { locale });
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    render: h => h(App),
});
