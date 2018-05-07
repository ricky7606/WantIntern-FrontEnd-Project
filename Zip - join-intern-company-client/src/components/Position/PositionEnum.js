import * as MetaProxy from '@/api/proxy.js'

export const mapReqEdu = {
  BACHELOR: '本科',
  COLLEGE: '专科',
  MASTER: '硕士',
  PHD: '博士',
}

export const mapReqGender = {
  MALE: '男',
  FEMALE: '女',
}

export const mapReqLangLevel = {
  NORMAL: '正常',
  GOOD: '较好',
  SKILLED: '流利',
  PROFICIENT: '专业',
}

// {
//   "id": 1,
export const PositionEnum = [
  {
    key: 'title',
    title: '职位名称',
    type: 'String',
  },
  // {
  //   key: 'area',
  //   title: '工作地区',
  //   type: 'String',
  // },
  {
    key: 'addr',
    title: '工作地址',
    type: 'String',
  },
  {
    key: 'ptype',
    title: '职位类型',
    type: 'Enum',
    enumList: [],
  },
  {
    key: 'startDate',
    title: '实习日期',
    type: 'Date',
  },
  {
    key: 'endDate',
    title: '至',
    type: 'Date',
  },
  {
    key: 'startTime',
    title: '工作时间',
    type: 'Time',
  },
  {
    key: 'endTime',
    title: '至',
    type: 'Time',
  },
  {
    key: 'salary',
    title: '实习工资',
    type: 'Number',
    applyTo: 'stuSalary',
  },
  {
    key: 'unit',
    title: '实习工资单位',
    type: 'Enum',
    enumList: [
      // {
      //   key: '元/小时',
      //   title: '元/小时',
      // },
      {
        key: '元/天',
        title: '元/天',
      },
      // {
      //   key: '元/周',
      //   title: '元/周',
      // },
      {
        key: '元/月',
        title: '元/月',
      },
    ],
  },
  {
    key: 'stuSalary',
    title: '学生到手工资',
    type: 'BindTo:salary',
    hintText: '（职位上线后显示学生到手工资，差额为平台收取的流转税费及平台为学生购买保险的费用。）',
  },
  {
    key: 'minDays',
    title: '每周最少工作时间',
    type: 'Number',
    unit: '天',
  },
  // {
  //   key: 'continuous',
  //   title: '是否要求连续工作',
  //   type: 'Boolean',
  // },
  {
    key: 'count',
    title: '招聘人数',
    type: 'Number',
    unit: '人',
  },
  {
    key: 'retention',
    title: '是否可以留任',
    type: 'Boolean',
    allowNull: true,
  },
  {
    key: 'intro',
    title: '职位描述',
    type: 'MultilineString',
  },

  // {
  //   key: 'reqGender',
  //   title: '性别',
  //   type: 'Enum',
  //   allowNull: true,
  //   enumList: [
  //     {
  //       key: '',
  //       title: '不限',
  //     },
  //     {
  //       key: 'MALE',
  //       title: '男',
  //     },
  //     {
  //       key: 'FEMALE',
  //       title: '女',
  //     },
  //   ],
  // },
  {
    key: 'reqEdu',
    title: '学历',
    type: 'Enum',
    hintText: '(此处填写学历将限制学生投递，低于此学历学生无法投递)',
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
  // {
  //   key: 'reqGrade',
  //   title: '年级',
  //   type: 'Enum',
  //   enumList: [
  //     {
  //       key: 1,
  //       title: '1',
  //     },
  //     {
  //       key: 2,
  //       title: '2',
  //     },
  //     {
  //       key: 3,
  //       title: '3',
  //     },
  //     {
  //       key: 4,
  //       title: '4',
  //     },
  //     // {
  //     //   key: 5,
  //     //   title: '5',
  //     // },
  //   ]
  // },
  // {
  //   key: 'reqMajor',
  //   title: '专业',
  //   type: 'String',
  // },
  // {
  //   key: 'reqLang',
  //   title: '外语语种',
  //   type: 'String',
  // },
  // {
  //   key: 'reqLangLevel',
  //   title: '外语水平',
  //   type: 'Enum',
  //   enumList: [
  //     {
  //       key: 'NORMAL',
  //       title: '一般',
  //     },
  //     {
  //       key: 'GOOD',
  //       title: '良好',
  //     },
  //     {
  //       key: 'SKILLED',
  //       title: '熟练',
  //     },
  //     {
  //       key: 'PROFICIENT',
  //       title: '精通',
  //     },
  //   ]
  // },
]
// }

MetaProxy.Get(
  'POSITION_TYPE',
  res => {
    if (res) {
      let item = PositionEnum.find(i => i.key === 'ptype')
      if (item && item.enumList) {
        if (res.forEach) {
          item.enumList.splice(0)
          res.forEach(i => item.enumList.push(i))
        } else {
          item.enumList = res
        }
        // item.enumList = res
        // console.log(item)
      }
    }
  }
)
