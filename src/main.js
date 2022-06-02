import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入字体图标
import './Icons';
// 引入moment
import moment from 'moment';
Vue.prototype.$moment = moment;
// 引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
// 引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;
// 引入MD5加密插件
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;
// 引入js-cookie
import Cookies from 'js-cookie';

// 引入mathjs
import * as math from 'mathjs';
Vue.prototype.$math = math;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
