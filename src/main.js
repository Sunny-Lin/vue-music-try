import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import 'common/stylus/index.styl'
import fastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import Axios from 'axios'

// Vue.config.productionTip = false

// Vue.prototype.$axios = Axios;  //19.9.1
// Axios.defaults.baseURL = '/api'
// Axios.defaults.headers.post['Content-Type'] = 'application/json';

/* eslint-disable no-new */
fastClick.attach(document.body)

Vue.use(VueLazyload,{
  loading: require('common/image/default.png')
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
