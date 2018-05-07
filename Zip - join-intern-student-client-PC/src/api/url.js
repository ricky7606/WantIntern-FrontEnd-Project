// const BASE_URL = 'http://yegames.cn:8080/api'
// const BASE_URL = 'http://x.xiangshixi.cc:8080/api'
let BASE_URL = `${location.origin}/backend/api`
if (location.host.indexOf('localhost') !== -1) {
  // BASE_URL = '//x.xiangshixi.cc:8080/api'
  BASE_URL = '//www.xiangshixi.com/backend/api'
  // BASE_URL = 'http://yegames.cn:8080/api'
}

function joinUrl (relativeUrl) {
  if (relativeUrl.indexOf('/') !== 0) relativeUrl = `/${relativeUrl}`
  return `${BASE_URL}${relativeUrl}`
}

const URL_STUDENT = '/students'
export const StudentSubUrl = {
  register () {
    let relativeUrl = `${URL_STUDENT}`
    return joinUrl(relativeUrl)
  },
  login () {
    let relativeUrl = `${URL_STUDENT}/login`
    return joinUrl(relativeUrl)
  },
  wechatLogin (id) {
    let relativeUrl = `${URL_STUDENT}/login/wechat?unionid=${id}`
    return joinUrl(relativeUrl)
  },
  // 获取学生信息
  getItem (studentId = 0) {
    let relativeUrl = `${URL_STUDENT}/${studentId}`
    return joinUrl(relativeUrl)
  },
  putItem (studentId = 0) {
    let relativeUrl = `${URL_STUDENT}/${studentId}`
    return joinUrl(relativeUrl)
  },
  resumeCount (studentId = 0) {
    // /api/students/0/resumes/count
    let relativeUrl = `${URL_STUDENT}/${studentId}/resumes/count`
    return joinUrl(relativeUrl)
  },
}

const URL_COMPANY = '/companies'
export const CompanySubUrl = {
  register () {
    let relativeUrl = `${URL_COMPANY}`
    return joinUrl(relativeUrl)
  },
  getList () {
    let relativeUrl = `${URL_COMPANY}`
    return joinUrl(relativeUrl)
  },
  login () {
    let relativeUrl = `${URL_COMPANY}/login`
    return joinUrl(relativeUrl)
  },
  // 获取企业信息
  getItem (companyId) {
    let relativeUrl = `${URL_COMPANY}/${companyId}`
    return joinUrl(relativeUrl)
  },
  // 修改企业信息
  editItem (companyId) {
    let relativeUrl = `${URL_COMPANY}/${companyId}`
    return joinUrl(relativeUrl)
  },
  // 获取企业的职位信息
  getPositionsOfCompany (companyId) {
    let relativeUrl = `${URL_COMPANY}/${companyId}/positions`
    return joinUrl(relativeUrl)
  },
  // 获取企业收到的简历信息
  getResumesOfCompany (companyId) {
    let relativeUrl = `${URL_COMPANY}/${companyId}/resumes`
    return joinUrl(relativeUrl)
  },
  getRateList (companyId) {
    let relativeUrl = `${URL_COMPANY}/${companyId}/rates`
    return joinUrl(relativeUrl)
  },
}

const URL_POSITIONS = '/positions'
export const PositionSubUrl = {
  // 获取企业的职位信息
  getListOfCompany: CompanySubUrl.getPositionsOfCompany,
  // getListOfCompany (companyId) {
  //   let relativeUrl = `/companies/${companyId}/positions`
  //   return joinUrl(relativeUrl)
  // },
  // 筛选职位列表
  getList () {
    let relativeUrl = `${URL_POSITIONS}`
    return joinUrl(relativeUrl)
  },
  // 新增职位信息
  addItem () {
    let relativeUrl = `${URL_POSITIONS}`
    return joinUrl(relativeUrl)
  },
  // 获取订阅的职位列表
  getSubscription () {
    let relativeUrl = `${URL_POSITIONS}/subscription`
    return joinUrl(relativeUrl)
  },
  // 获取职位信息
  getItem (positionId) {
    let relativeUrl = `${URL_POSITIONS}/${positionId}`
    return joinUrl(relativeUrl)
  },
  // 修改职位信息
  editItem (positionId) {
    let relativeUrl = `${URL_POSITIONS}/${positionId}`
    return joinUrl(relativeUrl)
  },
  // 获取职位的简历信息
  getResumesOfPosition (positionId) {
    let relativeUrl = `${URL_POSITIONS}/${positionId}/resumes`
    return joinUrl(relativeUrl)
  },
  // 收藏
  addPositionToCollect (positionId) {
    let relativeUrl = `${URL_POSITIONS}/${positionId}/collect`
    return joinUrl(relativeUrl)
  },
  deletePositionToCollect (positionId) {
    let relativeUrl = `${URL_POSITIONS}/${positionId}/collect`
    return joinUrl(relativeUrl)
  },
  getPositionCollects () {
    let relativeUrl = `${URL_POSITIONS}/collect`
    return joinUrl(relativeUrl)
  },
}

export const Resume = {
  BASE_URL: '/resumes',
  // 获取学生投出的简历信息
  getResumesOfStudent (studentId) {
    let relativeUrl = `/students/${studentId}/resumes`
    return joinUrl(relativeUrl)
  },

  // 获取企业收到的简历信息
  getResumesOfCompany: CompanySubUrl.getResumesOfCompany,

  // 获取职位的简历信息
  getResumesOfPosition: PositionSubUrl.getResumesOfPosition,
  // 学生投递简历
  postResume () {
    let relativeUrl = `${this.BASE_URL}`
    return joinUrl(relativeUrl)
  },
  getResumeItem (resumeId) {
    let relativeUrl = `${this.BASE_URL}/${resumeId}`
    return joinUrl(relativeUrl)
  },
  editResumeItem (resumeId) {
    let relativeUrl = `${this.BASE_URL}/${resumeId}`
    return joinUrl(relativeUrl)
  },
  // POST ranks
  rankResumeItem (resumeId) {
    let relativeUrl = `${this.BASE_URL}/${resumeId}/rate`
    return joinUrl(relativeUrl)
  },
}

// 资讯相关
const URL_NEWS = '/news'
export const NewsSubUrl = {
  getList () {
    let relativeUrl = `${URL_NEWS}`
    return joinUrl(relativeUrl)
  },
  getNewsItem (newsId) {
    let relativeUrl = `${URL_NEWS}/${newsId}`
    return joinUrl(relativeUrl)
  },
  // star
  postStarNewsItem (newsId) {
    let relativeUrl = `${URL_NEWS}/${newsId}/star`
    return joinUrl(relativeUrl)
  },
  deleteStarNewsItem (newsId) {
    let relativeUrl = `${URL_NEWS}/${newsId}/star`
    return joinUrl(relativeUrl)
  },
}

// 其他
export const OtherSubUrl = {
  // 获取账号积分记录
  getAccountLog (accountId) {
    let relativeUrl = `/accounts/${accountId}/pointLogs`
    return joinUrl(relativeUrl)
  },
  // 绑定微信OpenId
  putWechatOpenIdToAccount (accountId, unionId) {
    let relativeUrl = `/accounts/${accountId}/wechat?unionid=${unionId}`
    return joinUrl(relativeUrl)
  },
  // 登出
  postLogout (accountId) {
    let relativeUrl = `/accounts/logout`
    return joinUrl(relativeUrl)
  },
  // 发送验证码
  postCodes (sub) {
    let relativeUrl = `/codes${sub}`
    return joinUrl(relativeUrl)
  },
  // 验证验证码
  checkCodes (sub) {
    let relativeUrl = `/codes${sub}`
    return joinUrl(relativeUrl)
  },
  // 上传图片
  uploadImage (type) {
    let relativeUrl = `/upload/${type}`
    return joinUrl(relativeUrl)
  },
  // 工资修改
  putSalary (salaryId) {
    let relativeUrl = `/salaries/${salaryId}`
    return joinUrl(relativeUrl)
  },
  getSalary (salaryId) {
    let relativeUrl = `/salaries/${salaryId}`
    return joinUrl(relativeUrl)
  },
}

export const Account = {
  // /accounts/resetPassword
  resetPassword () {
    let relativeUrl = `/accounts/resetPassword`
    return joinUrl(relativeUrl)
  },
}

export const PointLogs = {
  BASE_URL: '/pointLogs',
  // 获取积分记录
  getAccountLogs (accountId) {
    let relativeUrl = `/accounts/${accountId}/pointLogs`
    return joinUrl(relativeUrl)
  },
  getLogs () {
    let relativeUrl = `${this.BASE_URL}`
    return joinUrl(relativeUrl)
  },
  getLogItem (plogId) {
    let relativeUrl = `${this.BASE_URL}/${plogId}`
    return joinUrl(relativeUrl)
  },
}

export const Notification = {
  BASE_URL: '/notifications',
  // 获取积分记录
  getList () {
    let relativeUrl = `${this.BASE_URL}`
    return joinUrl(relativeUrl)
  },
  getItem (notiId) {
    let relativeUrl = `${this.BASE_URL}/${notiId}`
    return joinUrl(relativeUrl)
  },
}

export const Wechat = {
  putWechatNumber (accountId) {
    let url = `/accounts/${accountId}/wechat`
    return url
  },
  // code获取unionid或者openid的接口：
  // get /wechat/accessToken?code=CODE
  GetToken () {
    let relativeUrl = `/wechat/accessToken`
    return joinUrl(relativeUrl)
  },
  // http://www.xiangshixi.com/backend/api/wechat/jssdkSign?url=www.xiangshixi.com
}

export const Meta = {
  BASE_URL: '/meta',
  // 获取积分记录
  post () {
    let relativeUrl = `${this.BASE_URL}`
    return joinUrl(relativeUrl)
  },
  get () {
    let relativeUrl = `${this.BASE_URL}`
    return joinUrl(relativeUrl)
  },
}
