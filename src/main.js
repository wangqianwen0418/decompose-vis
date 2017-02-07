
import Vue from 'vue';
import ElementUI from 'element-ui';
import './styles/index.css';
import store from './store';
import App from './components/App';

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    render: h => h(App),
});
