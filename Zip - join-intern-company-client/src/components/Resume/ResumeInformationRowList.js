export const NameList = [
  {
    key: 'school',
    title: '学校',
    type: 'String',
  },
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
]

export const OtherInformation = [
  {
    key: 'selfEval',
    title: '自我评价',
    type: 'MultilineString',
  },
  {
    key: 'workExp',
    title: '社会经验',
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

// 面试通知对象
export const InterviewItemList = [
  {
    key: 'interviewTime',
    title: '面试时间',
    type: 'DateTime',
  },
  {
    key: 'interviewPlace',
    title: '面试地址',
    type: 'String',
  },
  {
    key: 'contact',
    title: '联系人',
    type: 'String',
  },
  {
    key: 'contactPhone',
    title: '联系电话',
    type: 'Number',
  },
]
export const InterviewItemListReview = [
  {
    key: 'interviewTime',
    title: '面试时间',
    type: 'DateTime',
  },
  // {
  //   key: 'interviewPlace',
  //   title: '面试地址',
  //   type: 'String',
  // },
  // {
  //   key: 'contact',
  //   title: '联系人',
  //   type: 'String',
  // },
  // {
  //   key: 'contactPhone',
  //   title: '联系电话',
  //   type: 'Number',
  // },
]
// 工资 、入职时间、报道地点、联系人、联系方式  这五项
export const OfferItemList = [
  // {
  //   key: 'stuSalary',
  //   title: '工资',
  //   type: 'Number',
  // },
  {
    key: 'offerTime',
    title: '入职地点',
    type: 'DateTime',
  },
  {
    key: 'offerPlace',
    title: '报到地址',
    type: 'String',
  },
  {
    key: 'contact',
    title: '联系人',
    type: 'String',
  },
  {
    key: 'contactPhone',
    title: '联系方式',
    type: 'Number',
  },
]
