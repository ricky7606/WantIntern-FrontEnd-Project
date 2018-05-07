import * as MetaProxy from '@/api/proxy.js'

import {
 CompanyScaleList,
 CompanyTypeList,
 CompanyIndustryList,
} from '@/components/Account/CompanyEnum.js'

export const PersonalInfomation = [
  {
    key: 'name',
    title: '公司名称',
    type: 'String',
  },
  {
    key: 'addr',
    title: '公司地址',
    type: 'String',
  },
  {
    key: 'type',
    title: '公司性质',
    type: 'Enum',
    enumList: CompanyTypeList,
  },
  {
    key: 'scale',
    title: '公司规模',
    type: 'Enum',
    enumList: CompanyScaleList,
  },
  {
    key: 'industry',
    title: '行业分类',
    type: 'Enum',
    enumList: CompanyIndustryList,
  },
  {
    key: 'link',
    title: '公司网址',
    type: 'String',
    isAllowNull: true,
  },
  {
    key: 'video',
    title: '公司视频介绍(URL)',
    type: 'String',
    isAllowNull: true,
  },
  {
    key: 'code',
    title: '统一社会信用代码',
    type: 'String',
  },
  {
    key: 'logo',
    title: '公司Logo',
    type: 'ImageUrlString',
    max: 1,
    isAllowNull: true,
  },
  {
    key: 'intro',
    title: '公司简介',
    type: 'MultilineString',
  },
]

MetaProxy.Get('COMPANY_TYPE', res => {
  PersonalInfomation[2].enumList = res
})
MetaProxy.Get('COMPANY_SCALING', res => {
  PersonalInfomation[3].enumList = res
})
MetaProxy.Get('INDUSTRY', res => {
  PersonalInfomation[4].enumList = res
})

export const AccountInfomation = [
  {
    key: 'contact',
    title: '联系人',
    type: 'String',
  },
  {
    key: 'contactPos',
    title: '职位',
    type: 'String',
    isAllowNull: true,
  },
  {
    key: 'contactPhone',
    title: '手机号',
    type: 'String',
    // stringLength: '11',
  },
  {
    key: 'email',
    title: '邮箱',
    type: 'String',
  },
  {
    key: 'phone',
    title: '电话',
    type: 'String',
  },
  {
    key: 'avatar',
    title: '头像',
    type: 'ImageUrlString',
    max: 1,
    isAllowNull: true,
  },
  {
    key: 'phone',
    title: '地址',
    type: 'String',
  },
]

export const EducationInfomation = [
  {
    key: 'education',
    title: '学历',
    type: 'Enum',
    enumList: [
      {
        key: 'COLLEGE',
        title: '专科',
      },
      {
        key: 'BACHELOR',
        title: '本科',
      },
      {
        key: 'MASTER',
        title: '硕士',
      },
      {
        key: 'PHD',
        title: '博士',
      },
    ]
  },
  {
    key: 'major',
    title: '专业',
    type: 'String',
  },
  {
    key: 'grade',
    title: '年级',
    type: 'Enum',
    enumList: [
      {
        key: 1,
        title: '1',
      },
      {
        key: 2,
        title: '2',
      },
      {
        key: 3,
        title: '3',
      },
      {
        key: 4,
        title: '4',
      },
      // {
      //   key: 5,
      //   title: '5',
      // },
    ]
  },
  {
    key: 'language',
    title: '外语语种',
    type: 'String',
  },
  {
    key: 'langLevel',
    title: '外语水平',
    type: 'Enum',
    enumList: [
      {
        key: 'NORMAL',
        title: '一般',
      },
      {
        key: 'GOOD',
        title: '良好',
      },
      {
        key: 'SKILLED',
        title: '熟练',
      },
      {
        key: 'PROFICIENT',
        title: '精通',
      },
    ]
  },
  // {
  //   key: 'socialExp',
  //   title: '社会活动经验/工作经验',
  //   type: 'String',
  // },
]

export const OtherInformation = [
  {
    key: 'selfEval',
    title: '自我评价',
    type: 'MultilineString',
  },
  {
    key: 'workExp',
    title: '社会活动经验/工作经验',
    type: 'MultilineString',
  },
  {
    key: 'stuCard',
    title: '学生证',
    type: 'ImageUrlString',
    max: 1,
  },
  {
    key: 'certs',
    title: '荣誉证书',
    type: 'ImageUrlString.List',
    max: 'autoadd',
  },
]
