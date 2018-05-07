// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './MobileApp'
import router from './router'

import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(Mint)

Vue.config.productionTip = false
Vue.filter('imgbg', src => {
  if (!src) return {}

  src = parseAsRelativePath(src)
  return {
    backgroundImage: `url(${src})`
  }
})

function parseAsRelativePath (str) {
  /* eslint-disable */
  let rg = /^https?:\/\/[^\/]+(\/.*)/
  let result = str.match(rg)

  let host = location.origin
  if (host.indexOf('localhost') !== -1) {
    host = '//www.xiangshixi.com'
  } else {
    host = ''
  }
  if (result) {
    return `${host}${result[1]}`
  } else {
    return str
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
