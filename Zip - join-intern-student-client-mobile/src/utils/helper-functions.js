// 转化分页数据
export function ParsePagination (p) {
  return {
    total: p.pageCnt,
    current: p.pageIndex,
    pagesize: p.pageSize,
  }
}

export function joinWechatAuthUrl (d) {
  // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx520c15f417810387&redirect_uri=https%3A%2F%2Fchong.qq.com%2Fphp%2Findex.php%3Fd%3D%26c%3DwxAdapter%26m%3DmobileDeal%26showwxpaytitle%3D1%26vb2ctag%3D4_2030_5_1194_60&response_type=code&scope=snsapi_base&state=123#wechat_redirect
  let baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
  let { appid, redirectUri, scope, state } = d

  scope = scope || 'snsapi_base'
  redirectUri = encodeURIComponent(redirectUri)
  state = state || Math.random().toString().substr(2)
  return `${baseUrl}appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
}
