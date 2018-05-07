export const PersonalInfomation = [
  {
    key: 'name',
    title: '姓名',
    type: 'String',
  },
  {
    key: 'gender',
    title: '性别',
    type: 'Enum',
    enumList: [
      {
        key: 'MALE',
        title: '男',
      },
      {
        key: 'FEMALE',
        title: '女',
      },
    ]
  },
  {
    key: 'idNo',
    title: '身份证号码',
    type: 'String',
    stringLength: '18',
  },
  {
    key: 'phone',
    title: '手机号码',
    type: 'String',
    stringLength: '11',
  },
  {
    key: 'email',
    title: '邮箱',
    type: 'String',
  },
  {
    key: 'school',
    title: '学校',
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
