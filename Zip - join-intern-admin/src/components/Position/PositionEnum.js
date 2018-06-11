export const mapReqEdu = {
  BACHELOR: '本科',
  COLLEGE: '专科',
  MASTER: '硕士',
  PHD: '博士',
}
export const TabbarResumeSta = {
  NEW: '已投递',
  WAIT_STU_CONFIRM: '待学生确认',
  WAIT_COMP_CONFIRM: '待企业查看',
  CONFIRMED: '已查看',
  OFFERED: '待入职',
  WORKING: '已入职',
  ENDED: '实习结束',
  CANCELED: '被拒绝',
  COMMENTED: '待评论',
}
export const mapReqEduNum = {
  COLLEGE: '0',
  BACHELOR: '1',
  MASTER: '2',
  PHD: '3',
}
export const eduEnumList = [
  { value: 'BACHELOR', title: '本科' },
  { value: 'COLLEGE', title: '专科' },
  { value: 'MASTER', title: '硕士' },
  { value: 'PHD', title: '博士' },
]

export const mapReqGender = {
  MALE: '男',
  FEMALE: '女',
}
export const genderEnumList = [
  { value: 'MALE', title: '男' },
  { value: 'FEMALE', title: '女' },
]

export const mapReqLangLevel = {
  NORMAL: '正常',
  GOOD: '较好',
  SKILLED: '流利',
  PROFICIENT: '专业',
}
export const langLevelEnumList = [
  { value: 'NORMAL', title: '正常' },
  { value: 'GOOD', title: '较好' },
  { value: 'SKILLED', title: '流利' },
  { value: 'PROFICIENT', title: '专业' },
]

import {
  SalaryUnitList,
  EducationList,
  LanguageLevelList,
  StudentGradeList,
  GenderList,
} from '@/components/Account/CompanyEnum.js'
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
    type: 'String',
  },
  {
    key: 'stuSalary',
    title: '学生到手工资',
    type: 'String',
  },
  {
    key: 'unit',
    title: '实习工资单位',
    type: 'Enum',
    enumList: SalaryUnitList,
  },
  {
    key: 'minDays',
    title: '每周最少工作时间',
    type: 'String',
  },
  // {
  //   key: 'continuous',
  //   title: '是否要求连续工作',
  //   type: 'Boolean',
  // },
  {
    key: 'count',
    title: '招聘人数',
    type: 'String',
  },
  {
    key: 'retention',
    title: '是否可以留任',
    type: 'Boolean',
  },
  {
    key: 'intro',
    title: '职位描述',
    type: 'MultilineString',
  },

  {
    key: 'reqGender',
    title: '性别',
    type: 'Enum',
    enumList: GenderList,
  },
  {
    key: 'reqEdu',
    title: '学历',
    type: 'Enum',
    enumList: EducationList,
  },
  {
    key: 'reqGrade',
    title: '年级',
    type: 'Enum',
    enumList: StudentGradeList,
  },
  {
    key: 'reqMajor',
    title: '专业',
    type: 'String',
  },
  {
    key: 'reqLang',
    title: '外语语种',
    type: 'Enum',
    enumList: LanguageLevelList
  },
  {
    key: 'reqLangLevel',
    title: '外语水平',
    type: 'String',
  },
]
// }
