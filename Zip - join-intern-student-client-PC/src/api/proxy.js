import * as ReqUrl from '@/api/url.js'
import * as Req from '@/api/index.js'

// import {
//  CompanyScaleList,
//  CompanyTypeList,
//  CompanyIndustryList,
//  StudentGradeList,
//  LanguageLevelList,
//  EducationList,
// } from '@/components/Account/CompanyEnum.js'

// const CompanyPromotedList = [
//   {
//     logo: 'http://yegames.cn:8080/upload/COMPANY_LOGO/2017-10-21_19-31-52_6e3b0.png',
//     companyId: 1,
//   },
//   {
//     logo: 'http://yegames.cn:8080/upload/COMPANY_LOGO/2017-10-19_08-44-28_6f493.jpg',
//     companyId: 2,
//   },
//   {
//     logo: 'http://yegames.cn:8080/upload/COMPANY_LOGO/2017-10-19_15-13-23_b2950.jpg',
//     companyId: 5,
//   },
// ]
const store = {
  // 'COMPANY_SCALING': CompanyScaleList,
  // 'COMPANY_TYPE': CompanyTypeList,
  // 'INDUSTRY': CompanyIndustryList,
  // 'SALARY_UNIT': '',
  // 'GRADE_LIST': StudentGradeList,
  // 'LANGUAGE_LEVEL_LIST': LanguageLevelList,
  // 'EDUCATION_LIST': EducationList,
  // 推荐的企业列表
  // 'COMPANY_PROMOTED_LIST': CompanyPromotedList,

  // 新建
  // footer链接 和 联系地址
  // 'FOOTER_LINKS': [],
  // 'FOOTER_ADDRESS': '',
  // 协议
  // 'STU_AGREEMENT': '',
  // 'COMPANY_AGREEMENT': '',
  //
  // // 广告图
  // 'AD_BANNER_HUGE': [
  //   {
  //     title: '广告图1',
  //     img: 'http://yegames.cn:8080/xsx/stu/static/img/banner1.d53b3ff.png',
  //     url: 'http://yegames.cn:8080/xsx/stu/static/img/banner1.d53b3ff.png',
  //   },
  // ],
  // 'AD_BANNER_MEDIUM': [
  //   {
  //     title: '广告图2',
  //     img: 'http://yegames.cn:8080/xsx/stu/static/img/img1.1439d94.png',
  //     url: 'http://yegames.cn:8080/xsx/stu/static/img/img1.1439d94.png',
  //   },
  //   {
  //     title: '广告图3',
  //     img: 'http://yegames.cn:8080/xsx/stu/static/img/img2.fee3998.png',
  //     url: 'http://yegames.cn:8080/xsx/stu/static/img/img2.fee3998.png',
  //   },
  // ],
}

export function Get (key, cbfn = res => res, failCbfn = x => x) {
  if (store[key]) {
    setTimeout(() => cbfn(store[key]))
  } else {
    remoteFetch(key, res => {
      let data = JSON.parse(res.value)
      store[key] = data
      cbfn(data)
    }, failCbfn)
  }
}

export function Set (key, data, cbfn = res => res, failCbfn = x => x) {
  remoteUpdate(key, data, res => {
    cbfn(res)
    store[key] = data
  }, failCbfn)
}

// 获取
function remoteFetch (key, cbfn = res => res, failCbfn = x => x) {
  let url = ReqUrl.Meta.get()
  let data = {
    key
  }
  return Req.Get(url, data, res => {
    cbfn(res)
  }, fail => {
    if (fail.response.data && fail.response.data.status === 401) {
      alert(fail.response.data.userMessage)
    }
    failCbfn(fail.response.data)
  })
}
// 更新
function remoteUpdate (key, value, cbfn = res => res, failCbfn = x => x) {
  let url = ReqUrl.Meta.post()
  let data = {
    key,
    value: JSON.stringify(value),
  }
  return Req.Post(url, data, res => {
    cbfn(res)
  }, fail => {
    if (fail.response.data && fail.response.data.status === 401) {
      alert(fail.response.data.userMessage)
    }
    failCbfn(fail.response.data)
  })
}
