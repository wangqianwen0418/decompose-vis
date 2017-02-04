<<<<<<< HEAD
import ElementUI from 'element-ui';
import Vue from 'vue';
import './styles/index.css';
import store from './store';
import App from './components/App';
=======
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './App.vue';

Vue.use(ElementUI);
>>>>>>> dev

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    render: h => h(App),
});
