// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

Vue.filter('imgbg', url => {
  let host = location.host
  if (url.indexOf(host) !== -1) {
    return bgStyle(url)
  }

  let r = 'x.xiangshixi.cc:8080'
  let r2 = 'www.xiangshixi.cc'
  url = url.replace(r, 'www.xiangshixi.com')
  url = url.replace(r2, 'www.xiangshixi.com')

  if (url.indexOf('http') === -1) {
    return bgStyle(`//${url}`)
  } else {
    return bgStyle(url.replace(/^https?:/, ''))
  }

  function bgStyle (url) {
    return {
      backgroundImage: `url(${url})`
    }
  }
})
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
