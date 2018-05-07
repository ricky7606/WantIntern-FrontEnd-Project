export const styleFns = {
  methods: {
    imgBg (url) {
      let src = parseAsRelativePath(url)

      return {
        backgroundImage: `url(${src})`
      }
    },
    imgBgNoParse (url) {
      return {
        backgroundImage: `url(${url})`
      }
    },
  }
}

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
