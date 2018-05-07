export const AdminPageCategoryList = [
  {
    title: '基础数据',
    type: 'category',
    list: [
      {
        title: '公司规模',
        key: 'COMPANY_SCALING',
        type: 'item',
        path: 'company-scale'
      },
      {
        title: '公司性质',
        key: 'COMPANY_TYPE',
        type: 'item',
        path: 'company-type'
      },
      {
        title: '职位类型',
        key: 'POSITION_TYPE',
        type: 'item',
        path: 'position-type'
      },
      {
        title: '行业管理',
        key: 'INDUSTRY',
        type: 'item',
        path: 'industry'
      },
      {
        title: '友情链接',
        key: 'FOOTER_LINKS',
        type: 'item',
        path: 'footer-links'
      },
      {
        title: '联系地址',
        key: 'FOOTER_ADDRESS',
        type: 'item',
        path: 'footer-address'
      },
      {
        title: '关于我们',
        key: 'FOOTER_INTRO',
        type: 'api-item',
        path: 'footer-intro'
      },
      {
        title: '企业帮助',
        key: 'FOOTER_ENTERPRISE_HELP',
        type: 'api-item',
        path: 'footer-enterprise-help'
      },
      {
        title: '学生帮助',
        key: 'FOOTER_STUDENT_HELP',
        type: 'api-item',
        path: 'footer-student-help'
      },
      // {
      //   title: '工资单位管理',
      //   key: 'SALARY_UNIT',
      //   type: 'item',
      //   path: 'salary_unit'
      // },
      // {
      //   title: '年级管理',
      //   key: 'GRADE_LIST',
      //   type: 'item',
      //   path: 'grade_list'
      // },
      // {
      //   title: '语言等级管理',
      //   key: 'LANGUAGE_LEVEL_LIST',
      //   type: 'item',
      //   path: 'language_level_list'
      // },
      // {
      //   title: '学历管理',
      //   key: 'EDUCATION_LIST',
      //   type: 'item',
      //   path: 'education_list'
      // },
    ],
  },
  {
    title: '广告管理',
    type: 'category',
    list: [
      {
        title: '首页横幅广告',
        key: 'AD_BANNER_HUGE',
        type: 'item',
        path: 'AD_BANNER_HUGE'
      },
      {
        title: '悬浮广告',
        key: 'AD_BANNER_MEDIUM',
        type: 'item',
        path: 'AD_BANNER_MEDIUM'
      },
    ],
  },
  {
    title: '资讯管理',
    type: 'category',
    list: [
      // {
      //   title: '发布资讯',
      //   key: 'AD_BANNER_HUGE',
      //   type: 'item',
      //   path: 'AD_BANNER_HUGE'
      // },
      {
        title: '资讯列表',
        key: 'news',
        type: 'api-item',
        path: 'news'
      },
    ],
  },
  {
    title: '条款管理',
    type: 'category',
    list: [
      {
        title: '学生实习条款',
        key: 'STU_AGREEMENT',
        type: 'api-item',
        path: 'STU_AGREEMENT'
      },
      {
        title: '企业合作列表',
        key: 'COMPANY_AGREEMENT',
        type: 'api-item',
        path: 'COMPANY_AGREEMENT'
      },
    ],
  },
  {
    title: '企业管理',
    type: 'category',
    list: [
      {
        title: '企业列表',
        key: 'enterprise-list',
        type: 'api-item',
        path: 'enterprise-list'
      },
    ],
  },
  {
    title: '学生管理',
    type: 'category',
    list: [
      {
        title: '学生列表',
        key: 'student-list',
        type: 'api-item',
        path: 'student-list'
      },
      {
        title: '提现审批管理',
        key: 'withdraw-list',
        type: 'api-item',
        path: 'withdraw-list'
      },
    ],
  },
  {
    title: '工资表管理',
    type: 'category',
    list: [
      {
        title: '工资表管理',
        key: 'salary-list',
        type: 'api-item',
        path: 'salary-list'
      },
    ],
  },
  {
    title: '账号管理',
    type: 'category',
    list: [
      {
        title: '管理员管理',
        key: 'admin-list',
        type: 'api-item',
        path: 'admin-list'
      },
    ],
  },
  {
    title: '消息 和 站内信',
    type: 'category',
    list: [
      {
        title: '消息',
        key: 'message',
        type: 'api-item',
        path: 'message'
      },
      {
        title: '站内信',
        key: 'notification-center',
        type: 'api-item',
        path: 'notification-center'
      },
    ],
  },
  {
    title: '反馈',
    type: 'category',
    list: [
      {
        title: '用户反馈',
        key: 'feedback',
        type: 'api-item',
        path: 'feedback'
      },
    ],
  },
]

export const MapCategory = AdminPageCategoryList.reduce((dict, item) => {
  // map category to item
  let categoryTitle = item.title
  let list = item.list
  list.forEach(i => {
    dict[i.title] = categoryTitle
  })

  return dict
}, {})

export const AdminItemHeader = {
  'COMPANY_SCALING': [
    {
      key: 'title',
      title: '公司规模',
      type: 'String',
      action: 'Bind',
      actionToKey: 'key',
    }
  ],
  'COMPANY_TYPE': [
    {
      key: 'title',
      title: '公司性质',
      type: 'String',
      action: 'Bind',
      actionToKey: 'key',
    },
  ],
  'POSITION_TYPE': [
    {
      key: 'title',
      title: '职位类型',
      type: 'String',
      action: 'Bind',
      actionToKey: 'key',
    },
  ],
  'FOOTER_LINKS': [
    {
      key: 'title',
      title: '链接标题',
      type: 'String',
    },
    {
      key: 'url',
      title: '链接地址',
      type: 'String',
    },
  ],
  'FOOTER_ADDRESS': [
    {
      key: 'title',
      title: '地址',
      type: 'String',
    },
  ],
  'FOOTER_INTRO': [
    {
      key: 'title',
      title: '介绍',
      type: 'String',
    },
  ],
  'INDUSTRY': [
    {
      key: 'title',
      title: '行业名称',
      type: 'String',
      action: 'Bind',
      actionToKey: 'key',
    },
    {
      key: 'percent',
      title: '工资抽成(%)',
      type: 'Number',
    },
  ],
  'AD_BANNER_HUGE': [
    {
      key: 'title',
      title: '广告标题',
      type: 'String',
    },
    {
      key: 'img',
      title: '图片(上传替换)',
      type: 'Image',
    },
    {
      key: 'img',
      title: '图片Url(直接填写URL)',
      type: 'Link',
    },
    {
      key: 'url',
      title: '跳转链接',
      type: 'Link',
    },
  ],
  'AD_BANNER_MEDIUM': [
    {
      key: 'title',
      title: '广告标题',
      type: 'String',
    },
    {
      key: 'img',
      title: '图片URL',
      type: 'Image',
    },
    {
      key: 'img',
      title: '图片Url(直接填写URL)',
      type: 'Link',
    },
    {
      key: 'url',
      title: '跳转链接',
      type: 'Link',
    },
  ],
}
