// 用于获取连接上的search信息
let search = location.search
let params = {}

if (search) {
  var str = search.substr(1)
  params = str.split('&')
  .reduce(function (obj, pair) {
    if (pair === '') {
      return obj
    }
    let a = pair.split('=')
    let v = a[1].replace(/\+/g, '%20')
    obj[a[0]] = decodeURIComponent(v)
    obj[a[0].toLowerCase()] = decodeURIComponent(v)
    return obj
  }, {})
}
export default params
