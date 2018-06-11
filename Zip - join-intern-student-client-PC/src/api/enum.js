export const mapPhotoType = {
  STU_AVATAR: 'STU_AVATAR',
  STU_CARD: 'STU_CARD',
  STU_CERT: 'STU_CERT',
  COMPANY_LOGO: 'COMPANY_LOGO',
  COMPANY_CERT: 'COMPANY_CERT',
  OTHER: 'OTHER',
}

// 关于Resume state各个状态的解释如下：
// 0 - 新简历 NEW
//     企业拒绝 -> 7
//     企业发送面试邀请 -> 1
// 1 - 待学生确认面试时间 WAIT_STU_CONFIRM
//     学生修改时间 -> 2
//     学生确认 -> 3
// 2 - 待企业确认面试时间 WAIT_COMPANY_CONFIRM
//     企业修改时间 -> 1
//     企业确认 -> 3
// 3 - 已确认面试时间 CONFIRMED
//     企业发送offer -> 4
//     企业拒绝
// 4 - 待接受offer OFFERED
//     学生接受offer -> 5
//     学生拒绝 -> 7
// 5 - 实习中 WORKING
//     企业确认结束 -> 6
// 6 - 实习结束 ENDED
// 7 - 实习未进行 CANCELED
// 8 - 查询所有记录 HISTORY
export const mapResumeState = {
  NEW: 'NEW',
  WAIT_STU_CONFIRM: 'WAIT_STU_CONFIRM',
  WAIT_COMP_CONFIRM: 'WAIT_COMP_CONFIRM',
  CONFIRMED: 'CONFIRMED',
  OFFERED: 'OFFERED',
  WORKING: 'WORKING',
  ENDED: 'ENDED',
  CANCELED: 'CANCELED',
  COMMENTED: 'COMMENTED',
  HISTORY: 'HISTORY',

  list: [
    'NEW',
    'WAIT_STU_CONFIRM',
    'WAIT_COMPANY_CONFIRM',
    'CONFIRMED',
    'OFFERED',
    'WORKING',
    'ENDED',
    'CANCELED',
    'COMMENTED',
    'HISTORY',
  ]
}
// "id": 123,
// "state": "NEW",
// "interviewTime": "2017-10-01 08:00:00",
// "commentStu": "string",
// "commentComp": "string",
// "positionId": 0,
// "stuId": 0,
// "createTime": "2017-10-01 08:00:00",
// "updateTime": "2017-10-01 08:00:00"

export const mapRankState = {
  titleList: [
    '同事氛围',
    '学习机会',
    '职业发展',
    '办公环境',
    '福利待遇',
  ],
}
