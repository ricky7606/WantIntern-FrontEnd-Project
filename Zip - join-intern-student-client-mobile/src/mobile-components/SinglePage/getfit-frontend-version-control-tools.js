// 时间格式
var defaultFormatString = 'yyyy-MM-ddThh:mm:ss'

function DateFormat (d, f) {
  var date = d || new Date()
  var format = f || defaultFormatString

  var o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "D+": date.getDate(), //day
    "h+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    "S": date.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                                                  (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  // handle month date hour minute second
  for (var k in o) if (new RegExp("(" + k + ")").test(format))
  format = format.replace(RegExp.$1,
                          RegExp.$1.length == 1 ?
                            o[k] :
                            ("00" + o[k]).substr(("" + o[k]).length));

  return format
}

module.exports = {
  Format: DateFormat
}
